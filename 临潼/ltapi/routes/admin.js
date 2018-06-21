var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var query = require("../config/db");
var multiparty = require('multiparty');
var fs = require("fs");
router.get('/adminstation', function (req, res) {
    var sql = 'select * from doc';
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


//说明
//.
////post 后台上传 内容 接口
router.post('/adminNewsadd', function (req, res) {
    var BigClassID = req.body.BigClassID;
    var SmallClassID = req.body.SmallClassID;
    var Title = req.body.Title;
    var Time = req.body.Time;
    var Author = req.body.Author;
    var Context = req.body.Context;
    var Pic = req.body.Pic;
    var sql = "INSERT INTO newsinfoes(BigClassID,SmallClassID,Title,Time,Author,Context,Pic) VALUES('" + BigClassID + "','" + SmallClassID + "','" + Title + "','" + Time + "','" + Author + "','" + Context + "','" + Pic + "')";

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

//说明
//.
////post 后台上传 内容 接口
router.post('/adminNewsaddEx', function (req, res) {
    var BigClassID = req.body.BigClassID;
    var SmallClassID = req.body.SmallClassID;
    var Title = req.body.Title;
    var Time = req.body.Time;
    var Author = req.body.Author;
    var Context = req.body.Context;
    var Status = req.body.Status;
    var UserId = req.body.UserId;
    var sql = "INSERT INTO tempinfoes(BigClassID,SmallClassID,Title,Time,Author,Context,Status,UserId) VALUES('" + BigClassID + "','" + SmallClassID + "','" + Title + "','" + Time + "','" + Author + "','" + Context + "'," + Status + "," + UserId + ")";

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

router.put('/adminNewsedit/:id', function (req, res) {
    var BigClassID = req.body.BigClassID;
    var SmallClassID = req.body.SmallClassID;
    var Title = req.body.Title;
    var Time = req.body.Time;
    var Author = req.body.Author;
    var Context = req.body.Context;
    var Pic = req.body.Pic;
    var sql = "UPDATE newsinfoes SET BigClassID= '" + BigClassID + "' ,SmallClassID='";
    sql += SmallClassID + "',Title='" + Title + "',Time='" + Time + "',Author='" + Author + "',Context='";
    sql += Context + "',Pic='" + Pic + "' WHERE Id=" + req.params.id;
    query(sql, function (error, doc) {
        if (error) {
            return res.json({ errCode: -1, result: error });
        }
        return res.json({ errCode: 0, result: console.log(doc) });
    })
});

router.put('/adminNewseditEx/:id', function (req, res) {
    var BigClassID = req.body.BigClassID;
    var SmallClassID = req.body.SmallClassID;
    var Title = req.body.Title;
    var Time = req.body.Time;
    var Author = req.body.Author;
    var Context = req.body.Context;
    var Status = req.body.Status;
    var UserId = req.body.UserId;
    var sql = "UPDATE tempinfoes SET BigClassID= '" + BigClassID + "' ,SmallClassID='";
    sql += SmallClassID + "',Title='" + Title + "',Time='" + Time + "',Author='" + Author + "',Context='";
    sql += Context + "',Status=" + Status + ",UserId=" + UserId + " WHERE Id=" + req.params.id;
    query(sql, function (error, doc) {
        if (error) {
            return res.json({ errCode: -1, result: error });
        }
        return res.json({ errCode: 0, result: console.log(doc) });
    })
})

//获取users数据
router.get('/users', function (req, res) {
    var sql = "select * from  userinfoes where Type != '1'";
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
//add users
router.post('/useradd', function (req, res) {
    var name = req.body.Name;
    var password = req.body.Password;
    var address = req.body.Address;
    var notes = req.body.Note;
    var sql = "INSERT INTO userinfoes(Name,Password,Address,Note,Type) VALUES('" + name + "','" + password + "','" + address + "','" + notes + "','2')";
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results
        });
    })
})

//edit users
router.put('/useredit/:id', function (req, res) {
    var sql = "UPDATE userinfoes SET Name = '" + req.body.Name + "',Password = '" + req.body.Password + "',Address = '" + req.body.Address + "',Note = '" + req.body.Note + "' WHERE Id = " + req.params.id;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results
        });
    })
})

router.get('/user/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from userinfoes where Id = ' + id;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results[0]
        });
    });
});
//delete users
router.delete('/deleteuser/:id', function (req, res) {
    var sql = "DELETE FROM userinfoes WHERE Id = " + req.params.id;
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
})

//获取工作日志
router.get('/log', function (req, res) {
    var sql = 'select * from  doc where fileId = 8 ';
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


//删除数据
router.delete('/delete/:id', function (req, res) {
    var sql = "DELETE FROM newsinfoes WHERE Id = " + req.params.id;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results
        });
    })
})
//删除数据
router.delete('/deleteEx/:id', function (req, res) {
    var sql = "DELETE FROM tempinfoes WHERE Id = " + req.params.id;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results
        });
    })
})

//工作日志审核上传状态
router.put('/adminLogStatus/:id', function (req, res) {
    var BigClassID = req.body.BigClassID;
    var SmallClassID = req.body.SmallClassID;
    var Title = req.body.Title;
    var Time = req.body.Time;
    var Author = req.body.Author;
    var Context = req.body.Context;
    var Status = req.body.Status;
    var Res = req.body.Res;
    var sql = "";
    if (Res){
        sql = "UPDATE tempinfoes SET Status = " + Status + "  WHERE Id=" + req.params.id;
    }else{
        sql = "UPDATE tempinfoes SET Status = " + Status + ", Res = " + Res + "  WHERE Id=" + req.params.id;
    }
    query(sql, function (error, doc) {
        if (error) {
            return res.json({ errCode: -1, result: error });
        }
        if (Status == 1) {//通过审核
            sql = "INSERT INTO newsinfoes(BigClassID,SmallClassID,Title,Time,Author,Context) VALUES('" + BigClassID + "','" + SmallClassID + "','" + Title + "','" + Time + "','" + Author + "','" + Context + "')";
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
        }
    })
})

router.post('/upload', function (req, res) {
    var form = new multiparty.Form({ uploadDir: 'D:/website/临潼气象信息网/WebApp/dist/assets/Upload' });
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({ errCode: -1, msg: err });
        } else {
            var upfs = files.uploadfiles;
            var temps = [];
            for (var i = 0; i < upfs.length; ++i) {
                var path = upfs[i].path;
                var ts = path.split('/');
                temps.push(ts[ts.length - 1]);
            }
            return res.json({ errCode: 0, data: temps });
        }
    });
});


module.exports = router;