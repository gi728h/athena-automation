import express, { urlencoded } from 'express';
import cors from 'cors';
import mysql from 'mysql';
import 'dotenv/config'; // This automatically loads the .env file
import morgan from 'morgan';


// import submitFormRouter from './app/api/submitform.js';
// import signupRouter from './app/api/signup.js';

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));


// // Use the submit form router
// app.use('/api', submitFormRouter);
// app.use('/api', signupRouter);

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
    res.status(200).send({results});
  });
});

app.get('/start', (req, res) => {
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "START"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Database test query failed:', err.message);
      return res.status(505).send('Database test query failed');
    }
    res.status(200).send({results});
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

app.get('/Tables',(req,res) => {
  const sql = `SELECT * FROM Df ORDER BY ID`;
  connection.query(sql,(err,results) => {
    if(err){
      console.error("Database test query failed: ",err.message);
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
// Start the server
const port = 3006; // Choose a port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;



