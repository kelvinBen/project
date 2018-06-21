var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '10.172.129.114',
    user: 'root',
    password: '123456',
    database: 'ltweather'
});
var query = function (sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, function (qerr, vals, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                callback(qerr, vals, fields);
            });
        }
    });
};
module.exports = query;