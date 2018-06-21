var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
app.use(bodyParser.json({ limit: '10mb' }));//设置post body数据的大小
app.use(bodyParser.urlencoded({
  "extended": false
}));
//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", '3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//get api
app.get('/charts', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select *  from doc', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});

//获取文件个数
app.post('/docByParameter', function (req, res) {
  var subId = req.body.subId;
  var num = req.body.num;//获取文件列表个数,>0表示取num条，<0取全部
  var sql = "";
  if (num > 0) {
    sql = 'select * from doc where subfileId = ' + subId + ' order by date DESC limit ' + num;
  } else {
    sql = 'select * from doc where subfileId = ' + subId + ' order by date DESC';
  }
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    // return res.json(rows);
    var ary = [];
    for (var i = 0; i < rows.length; ++i) {
      var item = rows[i];
      ary.push({
        id: item.id,
        fileId: item.fileId,
        subfileId: item.subfileId,
        title: item.title,
        date: item.date
      });
    }
    return res.json(ary);
  });
  connection.end();

});

//get warning config
app.get('/warningconfig', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select * from warningconfig', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});



app.get('/QueryById/:id', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  var id = req.params.id;
  connection.query("select * from doc where id = " + id, function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});

//pc端只获取前五条数据api
app.get('/QueryFiveMsg', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select * from doc LIMIT 0,5', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});

//微信端只获取前三条数据(特色产业)api
app.get('/QuerySpecial', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select * from doc WHERE fileId=7 LIMIT 0,3', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});
//微信端只获取前三条数据(新闻中心)api
app.get('/QueryNews', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select * from doc WHERE fileId=1 LIMIT 0,3', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});
//微信端只获取前三条数据(工作日志)api
app.get('/QueryLog', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  connection.query('select * from doc WHERE fileId=8 LIMIT 0,3', function (err, rows, fields) {
    if (err) {
      return res.json({ errCode: -1, msg: err });
    }
    return res.json(rows);
  });
  connection.end();
});
//add api
app.post('/charts/AddFile', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  // var fileId = req.body.fileId;
  var name = req.body.name;
  var post = {
    // fileId :fileId,
    name: name
  };
  connection.query("INSERT INTO file(name) VALUES('" + name + "')", function (err, rows) {
    if (err) {
      return res.json({ errCode: -1, result: err });
    }
    return res.json({ errCode: 0, result: rows.insertId });
  })
  connection.end();
})

// post 上传多个参数 api
app.post('/charts/aaa', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  });
  connection.connect();
  // var fileId = req.body.fileId;
  var name = req.body.name;
  var detail = req.body.detail;
  var post = {
    // fileId :fileId,
    name: name,
    detail: detail
  };
  connection.query("INSERT INTO doc(name,detail) VALUES('" + name + "','" + detail + "')", function (err, rows) {
    if (err) {
      return res.json({ errCode: -1, result: err });
    }
    return res.json({ errCode: 0, result: rows.insertId });
  })
  connection.end();
})


//update api
app.put('/charts/:id', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  })
  connection.connect();
  var id = req.params.id;
  connection.query("select * from file where fileId = " + id, function (err, art) {
    if (err) {
      return res.json({ errCode: -1, result: err });
    }
    art.name = req.body.name;
    connection.query("UPDATE file SET name='" + art.name + "'WHERE fileId='" + id + "'", function (error, doc) {
      if (error) {
        return res.json({ errCode: -1, result: error });
      }
      return res.json({ errCode: 0, result: id });
    })
    connection.end();
  });
})

//delete api
app.delete('/charts/:id', function (req, res) {
  var connection = mysql.createConnection({
    host: '120.26.44.171',
    user: 'yunmei',
    password: 'yunmei126',
    database: 'lingchuan'
  })
  connection.connect();
  var id = req.params.id;
  connection.query("DELETE FROM file WHERE fileId = '" + id + "'", function (err, doc) {
    if (err) {
      return res.json({ errCode: -1, result: err });
    }
    return res.json({ errCode: 0, result: id })
  })
  connection.end();
})

app.use('/home', require('./routes/home'));

app.use('/user', require('./routes/users'));

app.use('/map', require('./routes/map'));

app.use('/admin', require('./routes/admin'));

app.listen(3111, function () {
  console.log('listening on port 3111');
});



