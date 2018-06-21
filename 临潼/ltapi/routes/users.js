var express = require('express');
var router = express.Router();
var query = require("../config/db");

/* GET users listing. */
router.post('/login', function (req, res) {
  var name = req.body.name;
  var psw = req.body.password;
  var sql = "select * from userinfoes where name = '" + name + "' and password = '" + psw + "'";
  query(sql, function (err, results, fields) {
    if (err) {
      return res.json({ code: -1, msg: err, data: '' });
    }
    if (results.length == 0) {
      return res.json({ code: -1, msg: '用户名密码错误', data: '' });
    }
    return res.json({
      code: 0,
      msg: '',
      data: { userid: results[0].Id, username: results[0].Name, admin: results[0].Type }
    });
  });
});

module.exports = router;
