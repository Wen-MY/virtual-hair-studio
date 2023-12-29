// index.js
const mysql = require('mysql2');
const fs = require('fs');

// MySQL connection configuration
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3305,
  multipleStatements: true,
};

const createDatabaseAndInitialize = (databaseName, schemaPath) => {
  const connection = mysql.createConnection(connectionConfig);

  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to MySQL for ${databaseName}:`, err);
      process.exit(1);
    }

    // Create database
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`, (err) => {
      if (err) {
        console.error(`Error creating database ${databaseName}:`, err);
        connection.end();
        return;
      }

      // Use the created database
      connection.query(`USE \`${databaseName}\`;`, (err) => {
        if (err) {
          console.error(`Error using database ${databaseName}:`, err);
          connection.end();
          return;
        }

        // Read and execute SQL schema file
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');

        connection.query(schemaContent, (err) => {
          if (err) {
            console.error(`Error executing SQL for ${databaseName}:`, err);
          } else {
            console.log(`Database ${databaseName} initialized successfully.`);
          }

          // Close the connection after executing all SQL statements
          connection.end();
        });
      });
    });
  });
};

// Initialize databases
createDatabaseAndInitialize('vhs_info', './resources/vhs_info/V1_0_0__DDL_baseline.sql');
createDatabaseAndInitialize('vhs_um', './resources/vhs_um/V1_0_0__DDL_baseline.sql');
