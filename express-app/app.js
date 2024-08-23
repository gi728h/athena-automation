import express, { urlencoded } from 'express';
import cors from 'cors';
import mysql from 'mysql';
import 'dotenv/config'; // This automatically loads the .env file
import morgan from 'morgan'
import { default as expressWs } from 'express-ws';

// express-app/app.js


// import submitFormRouter from './app/api/submitform.js';
// import signupRouter from './app/api/signup.js';

const app = express();
const ws = expressWs(app);
const clients = new Set();
// const wss = new WebSocket('ws://localhost:3006');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));


// Default route
app.get('/', (req, res) => {
  res.send({ error: false, message: 'hello world' });
});
console.log(process.env.DB_HOST)

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

app.get('/test', (req, res) => {
  const sql = 'SELECT 1 + 1 AS solution';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send({ results });
  });
});

app.get('/start', (req, res) => {
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "START"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send({ results });
  });
})

app.get('/Fields', (req, res) => {
  const sql = `SELECT value FROM Fields where field_name = ${req.query.field_name}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.send(results);
  });
});

app.get('/Readings', (req, res) => {
  const sql = `SELECT ID_Reading,OD_Reading FROM Readings ORDER BY ID DESC LIMIT 10`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.send(results);
  });
});

app.get('/Tables', (req, res) => {
  const sql = `SELECT * FROM Df ORDER BY ID`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed: ", err.message);
      return res.status(505).send('Database test query failed');
    }
    res.send(results);
  });
});

app.get('/delete/Tables', (req, res) => {
  const sql = `DELETE FROM Df WHERE ID = ${req.query.ID}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send(results);
  });
});

app.post('/insert/Tables', (req, res) => {
  console.log(req.body);
  let keys = ""
  let values = ""
  for (const [key, value] of Object.entries(req.body)) {
    keys += `${key} ,`;
    values += `'${value}' ,`;
  }
  const sql = `INSERT INTO Df (${keys.slice(0, -1)}) VALUE (${values.slice(0, -1)})`;
  console.log(sql);
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send(results);
  });
});

app.post('/update/Tables', (req, res) => {
  console.log(req.body);
  let string = ""
  for (const [key, value] of Object.entries(req.body)) {
    string += `${key} = '${value}' ,`;
  }
  const sql = `UPDATE Df SET ${string.slice(0, -1)} WHERE ID = ${req.body.ID}`;
  console.log(sql);
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send(results);
  });
})

app.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.username == "admin" && req.body.password == "admin") {
    res.send({ success: true, session: "DJ06QPIFTAK4AWXB229J" });
  }
  res.send({ success: false });
})

app.get('/NewEntry', (req, res) => {
  const sql = `UPDATE Fields SET value = "False" WHERE field_name = "NEW_ENTRY"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send({ results });
  });
})
// Start the server
const port = 3006; // Choose a port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// app.ws('/Fields', function(ws, req) {
//   //an event listener is set up for incoming WebSocket messages.
// ws.on('message', function(msg) {

// });
// console.log('socket', req.testing);
// });


export default app;

const checkFlag = () => {
  connection.query('SELECT * FROM Fields WHERE field_name = "NEW_ENTRY"', (error, results) => {
    if (error) throw error;

    // If the flag is true, send a message to all connected WebSocket clients
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(results));
      }
    });

    // Optionally, reset the flag to false after sending the message
    // connection.query('UPDATE Flags SET value = false WHERE flag_name = "my_flag"');
  });
};

// Periodically check the flag every 5 seconds
setInterval(checkFlag, 5000);


app.ws('/ws', (ws, req) => {
  clients.add(ws);
  ws.on('close', () => {
    clients.delete(ws);
  }); 
});

