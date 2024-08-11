# Athena Automation Dashboard

Welcome to the Athena Automation Dashboard project. This is a web application built with React.

## Project Overview

Athena Automation Dashboard is a React-based web application designed to provide an interface for managing various automation tasks.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/athena-automation-dashboard.git



## Configuring Database

To configure the database connection, you need to create a `.env` file in the root directory of the 
express project.

Here's an example of how the `.env` file should look like:
DB_HOST=<db_url_here>
DB_USER=<db_username>
DB_PASSWORD=<db_password>
DB_PORT=<db_port>
DB_NAME=<db_name>

Once the `.env` file is configured, you need to create the required table(s) using the provided schema.


### Database Structure

1. Table "Fields" :
      --------------------------------------------------------------------------------------------
      | Column Name   | Data Type    | Description                                               |
      |---------------|--------------|-----------------------------------------------------------|
      | `field_name`  | `VARCHAR(50)`| The name of the field (e.g., status or measurement type). |
      | `value`       | `VARCHAR(50)`| The value associated with the field name.                 |
      --------------------------------------------------------------------------------------------
      In the **`field_name`** column the list of possible field names: `HIGH`, `LOW`, `ZERO`, `READINGS`.

## Getting Started

STEP 1 : Configure the database 

STEP 2 : run the express server

```bash
cd ./express-app
npm install
node app.js
```
STEP 3 : run the react develeopment sserver

```bash
cd .././react-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.


