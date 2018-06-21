var express = require('express');
var router = express.Router();
var moment = require("moment");
var crypto = require("crypto");
var pool = require("../config/database");
var secret = require("../config/secret");
var jwt = require('express-jwt');
var jwtToken = require("jsonwebtoken");

//用户登录
router.post('/login', function (req, res) {
  console.log(req.body);
  var name = req.body.name;
  var password = req.body.password;
  //生成加密的密码，采用不可逆的md5算法
  var md5 = crypto.createHash('md5');
  md5.update(password);
  var psd = md5.digest('hex');
  var sql = "select * from userinfoes where Name = ? and Password = ?";
  pool.query(sql, [name, password], function (err, results, fields) {
    if (err) {
      res.json({ code: -1, msg: err, data: '' });
    }
    var user = results[0];
    var expires = moment().add(7, 'days').valueOf();
    var token = jwtToken.sign({
      exp: expires,
      userId: user.Id
    }, secret.secretToken);
    res.json({
      code: 0,
      msg: '',
      data: {
        token: token,
        expires: expires
      }
    });
  });
});

//添加新用户
router.post('/add', jwt({ secret: secret.secretToken }), function (req, res) {
  res.json(req.user);
  //根据user确定他是否有调用这个api的权限

});

//edit
router.put('/edit/:id', jwt({secret: secret.secretToken}), function (req, res) {
    
})

//error handle
router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.json({ code: -1, msg: 'invalid token', data: '' });
  }
});

module.exports = router;
