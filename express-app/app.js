import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import 'dotenv/config'; // This automatically loads the .env file


// import submitFormRouter from './app/api/submitform.js';
// import signupRouter from './app/api/signup.js';

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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

// Start the server
const port = 3003; // Choose a port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;



