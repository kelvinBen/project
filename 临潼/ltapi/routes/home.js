var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var query = require("../config/db");

router.post('/docByParameter', function (req, res) {
    var subId = req.body.subId;
    var num = req.body.num;//获取文件列表个数,>0表示取num条，<0取全部
    var sql = "";
    if (num > 0) {
        sql = 'select * from newsinfoes where SmallClassID = ' + subId + ' order by Time DESC limit ' + num;
    } else {
        sql = 'select * from newsinfoes where SmallClassID = ' + subId + ' order by Time DESC';
    }
    // console.log(sql);
    query(sql, function (err, results, fields) {
        // console.log(err);
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        var ary = [];
        for (var i = 0; i < results.length; ++i) {
            var item = results[i];
            ary.push({
                id: item.Id,
                BigClassID: item.BigClassID,
                SmallClassID: item.SmallClassID,
                title: item.Title,
                time: item.Time,
                pic: item.Pic
            });
        }
        return res.json({
            code: 0,
            msg: '',
            data: ary
        });
    });
});

router.get('/warning', function (req, res) {
    var sql = 'select * from warningconfig';
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

router.get('/category', function (req, res) {
    var sql = 'select * from bigcategories';
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

router.get('/category/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from bigcategories where Id = ' + id;
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

router.get('/subcategory', function (req, res) {
    var sql = 'select * from smallcategories';
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
//根据fileId获取总列表内信息
router.get('/subcategory/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from smallcategories where BigClassID = ' + id + ' order by Id';
    // console.log(sql);
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
//获取文件总数
router.post('/queryFileCount', function (req, res) {
    var subId = req.body.subId;
    var sql = 'select COUNT(*) from newsinfoes where SmallClassID = ' + subId;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results[0]['COUNT(*)']
        });
    });
});

router.post('/fileList', function (req, res) {
    var subId = req.body.subId;
    var pageNum = req.body.pageNum;
    var page = req.body.page;
    var num = (page - 1) * pageNum;
    var sql = 'select * from newsinfoes where SmallClassID = ' + subId + ' order by Time desc limit ' + num + ', ' + pageNum;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        var ary = [];
        for (var i = 0; i < results.length; ++i) {
            var item = results[i];
            ary.push({
                Id: item.Id,
                BigClassID: item.BigClassID,
                SmallClassID: item.SmallClassID,
                Title: item.Title,
                Time: item.Time,
                Author: item.Author
            });
        }
        return res.json({
            code: 0,
            msg: '',
            data: ary
        });
    });
});

router.get('/file/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from newsinfoes where Id = ' + id;
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

//获取审核文件个数
router.post('/queryFileCountEx', function (req, res) {
    var subId = req.body.subId;
    var sql = 'select COUNT(*) from tempinfoes where SmallClassID = ' + subId;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results[0]['COUNT(*)']
        });
    });
});
router.post('/fileListEx', function (req, res) {
    var subId = req.body.subId;
    var pageNum = req.body.pageNum;
    var page = req.body.page;
    var num = (page - 1) * pageNum;
    var sql = 'select * from tempinfoes where SmallClassID = ' + subId + ' order by Time desc limit ' + num + ', ' + pageNum;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        var ary = [];
        for (var i = 0; i < results.length; ++i) {
            var item = results[i];
            ary.push({
                Id: item.Id,
                BigClassID: item.BigClassID,
                SmallClassID: item.SmallClassID,
                Title: item.Title,
                Time: item.Time,
                Author: item.Author,
                Status: item.Status
            });
        }
        return res.json({
            code: 0,
            msg: '',
            data: ary
        });
    });
});
router.get('/fileEx/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from tempinfoes where Id = ' + id;
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

//获取审核文件个数
router.post('/queryStationFileCount', function (req, res) {
    var subId = req.body.subId;
    var userId = req.body.userId;
    var sql = 'select COUNT(*) from tempinfoes where SmallClassID = ' + subId + " and UserId = " + userId;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        return res.json({
            code: 0,
            msg: '',
            data: results[0]['COUNT(*)']
        });
    });
});
router.post('/stationFileListEx', function (req, res) {
    var subId = req.body.subId;
    var userId = req.body.userId;
    var pageNum = req.body.pageNum;
    var page = req.body.page;
    var num = (page - 1) * pageNum;
    var sql = 'select * from tempinfoes where SmallClassID = ' + subId + ' and UserId = ' + userId + ' order by Time desc limit ' + num + ', ' + pageNum;
    query(sql, function (err, results, fields) {
        if (err) {
            return res.json({ code: -1, msg: err, data: '' });
        }
        var ary = [];
        for (var i = 0; i < results.length; ++i) {
            var item = results[i];
            ary.push({
                Id: item.Id,
                BigClassID: item.BigClassID,
                SmallClassID: item.SmallClassID,
                Title: item.Title,
                Time: item.Time,
                Author: item.Author,
                Status: item.Status
            });
        }
        return res.json({
            code: 0,
            msg: '',
            data: ary
        });
    });
});
module.exports = router;