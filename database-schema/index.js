// index.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// MySQL connection configuration
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  multipleStatements: true,
};

const createDatabaseAndInitialize = async (databaseName) => {
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
          else {
            console.log(`Database ${databaseName} initialized successfully.`);
            resolve();
          }
        });
      });
    });
  });
};

const executeSqlStatement = async (databaseName, schemaPath, version, operation, name) => {
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
            console.log(`Executed ${version} migration : ${name} into ${databaseName} successfully. Operation : ${operation}`);
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
const migrateDatabases = async (resourcesPath) => {
  const directories = fs.readdirSync(resourcesPath, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  for (const directory of directories) {
    const databaseName = directory;
    const directoryPath = path.join(resourcesPath, directory);
    await createDatabaseAndInitialize(databaseName);

    const sqlFiles = fs.readdirSync(directoryPath)
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => {
        // Get version numbers from filenames
        const getVersion = (filename) => filename.split('__')[0].slice(1).split('_').map(Number);

        const [majorA, minorA, patchA] = getVersion(a);
        const [majorB, minorB, patchB] = getVersion(b);

        // Compare versions
        if (majorA !== majorB) {
          return majorA - majorB;
        } else if (minorA !== minorB) {
          return minorA - minorB;
        } else {
          return patchA - patchB;
        }
      });

    for (const sqlFile of sqlFiles) {
      const version = sqlFile.split('__')[0].slice(1);
      const migrationOperation = sqlFile.split('__')[1].split('_')[0];
      const migrationName = sqlFile.split('__')[1].split('_').slice(1).join('_').split('.sql')[0]; // Extract migration name from filename
      const schemaPath = path.join(directoryPath, sqlFile);
      await executeSqlStatement(databaseName, schemaPath, version, migrationOperation, migrationName);
    }
  }

  console.log("All databases migrated successfully.");
  process.exit(); 
};

migrateDatabases('./resources')
  .catch((error) => console.error('Error:', error));

/* old manual version , deprecated version
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
  .then(() => createDatabaseAndInitialize('vhs_tryon', './resources/vhs_tryon/V1_0_0__DDL_baseline.sql'))
  .then(() => executeSqlStatement('vhs_um', './resources/vhs_um/V1_0_1__DML_preset.sql'))
  .then(() => executeSqlStatement('vhs_info','./resources/vhs_info/V1_0_1__DML_preset.sql'))
  .then(() => executeSqlStatement('vhs_tryon','./resources/vhs_tryon/V1_0_1__DML_preset.sql'))
  //.then(() => ) for more execution
  .catch((error) => console.error('Error:', error));


*/