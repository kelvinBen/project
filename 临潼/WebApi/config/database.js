var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit: 10,
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'ltweather'
});

module.exports = pool;
