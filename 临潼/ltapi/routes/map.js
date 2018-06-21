var express = require('express');
var router = express.Router();
var query = require("../config/db");

/* GET users listing. */
router.get('/stations', function (req, res) {
  var name = req.body.name;
  var psw = req.body.password;
  var sql = 'select * from areastation';
  query(sql, function (err, results, fields) {
    if (err) {
      return res.json({ code: -1, msg: err, data: '' });
    }
    return res.json({
      code: 0,
      msg: '',
      data: results
    });
  });
});

module.exports = router;