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

const createDatabaseAndInitialize = async (databaseName, schemaPath) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);

    connection.connect((err) => {
      if (err) {
        console.error(`Error connecting to MySQL for ${databaseName}:`, err);
        reject(err);
      }

      // Create database
      connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`, (err) => {
        if (err) {
          console.error(`Error creating database ${databaseName}:`, err);
          connection.end();
          reject(err);
        }

        // Use the created database
        connection.query(`USE \`${databaseName}\`;`, (err) => {
          if (err) {
            console.error(`Error using database ${databaseName}:`, err);
            connection.end();
            reject(err);
          }

          // Read and execute SQL schema file
          const schemaContent = fs.readFileSync(schemaPath, 'utf8');

          connection.query(schemaContent, (err) => {
            if (err) {
              console.error(`Error executing SQL for ${databaseName}:`, err);
              reject(err);
            } else {
              console.log(`Database ${databaseName} initialized successfully.`);
              resolve();
            }

            // Close the connection after executing all SQL statements
            connection.end();
          });
        });
      });
    });
  });
};

const executeSqlStatement = async (databaseName, schemaPath) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);

    connection.connect((err) => {
      if (err) {
        console.error(`Error connecting to MySQL for ${databaseName}:`, err);
        reject(err);
      }

      // Use the created database
      connection.query(`USE \`${databaseName}\`;`, (err) => {
        if (err) {
          console.error(`Error using database ${databaseName}:`, err);
          connection.end();
          reject(err);
        }

        // Read and execute SQL schema file
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');

        connection.query(schemaContent, (err) => {
          if (err) {
            console.error(`Error executing SQL for ${databaseName}:`, err);
            reject(err);
          } else {
            console.log(`Insertion data into ${databaseName} successfully.`);
            resolve();
          }

          // Close the connection after executing all SQL statements
          connection.end();
        });
      });
    });
  });
};

// Initialize databases and execute SQL statements sequentially
createDatabaseAndInitialize('vhs_info', './resources/vhs_info/V1_0_0__DDL_baseline.sql')
  .then(() => createDatabaseAndInitialize('vhs_um', './resources/vhs_um/V1_0_0__DDL_baseline.sql'))
  .then(() => executeSqlStatement('vhs_um', './resources/vhs_um/V1_0_1__DML_preset.sql'))
  .then(() => executeSqlStatement('vhs_info','./resources/vhs_info/V1_0_1__DML_preset.sql'))
  //.then(() => ) for more execution
  .catch((error) => console.error('Error:', error));
