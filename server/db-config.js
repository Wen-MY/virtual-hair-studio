const mysql = require('mysql2/promise');  // Import mysql2 promise-based library
const user = 'root';
const pass = 'root';

// Create a pool for vhm_um table
const poolUM = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: user,
    password: pass,
    database: 'vhs_um',
});

// Create a pool for vhm_info table
const poolInfo = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: user,
    password: pass,
    database: 'vhs_info',
});

module.exports = {
    poolUM: poolUM,
    poolInfo: poolInfo
};
