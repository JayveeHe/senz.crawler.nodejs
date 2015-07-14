var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var cloud = require('./cloud');
var bugsnag = require("bugsnag");
bugsnag.register("3167e1aa5dac8886257543b8a71f195f");
//parser manager
var ParserManager = require('./parser_hub/parser_manager');

var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(function (req, res, next) {
//    next()
//});
app.use(cookieParser());

app.get('/status', function (req, res) {
    res.send('The server is running');
});

app.post('/:service_name', function (req, res) {
    //console.log(req);
    service_name = req.params.service_name;
    //res.send(req.params.service_name);
    var rawdata = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function (chunk) {    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        rawdata += chunk;
    });

    req.on('end', function () {    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        //console.log(rawdata);
        var post_data = JSON.parse(rawdata);
        console.log(post_data);
        var url = post_data.url;
        ParserManager.ParseURL(service_name, url).then(function (data) {
            res.send(data);
        }, function (err) {
            res.send(err);
        })

    });
})

// 可以将一类的路由单独保存在一个文件中
//app.use('/todos', todos);

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
