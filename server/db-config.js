const mysql = require('mysql');
const user = 'root';
const pass = 'root';

const db = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : user,
    password        : pass,
    database        : 'vhm_users'
})

module.exports = db;