/**
 * Created by Jayvee on 2015/7/11.
 */
var wandoujia = require("./parser_hub/parsers/wandoujia");
var url = "http://www.wandoujia.com/apps/aimoxiu.theme.qmtizinw";


wandoujia.do(url)
    .then(function (resp) {
        console.log('wandoujia success')
        console.log(resp);
    }, function (err) {
        console.log('wandoujia failed')
        console.log(err)
    });


var appchina = require('./parser_hub/parsers/appchina')
appchina.do("www.appchina.com/app/aimoxiu.theme.qmtizinw")
    .then(function (resp) {
        console.log('success')
        console.log(resp);
    }, function (err) {
        console.log('failed')
        console.log(err)
    });


var qihu = require('./parser_hub/parsers/qihu360')
qihu.do(url).then(function (resp) {
    console.log('qihu success')
    console.log(resp);
}, function (err) {
    console.log('qihu failed')
    console.log(err)
});

var apple = require('./parser_hub/parsers/appleitunes')
apple.do(url).then(function (resp) {
    console.log('apple success')
    console.log(resp);
}, function (err) {
    console.log('apple failed')
    console.log(err)
});


var googleplay = require('./parser_hub/parsers/googleplay')
apple.do("https://play.google.com/store/apps/details?id=com.google.android.GoogleCamera").then(function (resp) {
    console.log('google success')
    console.log(resp);
}, function (err) {
    console.log('google failed')
    console.log(err)
});

var ker = require('./parser_hub/parsers/kr36next')
ker.do("http://next.36kr.com/posts/2648").then(function (resp) {
    console.log('36kr success')
    console.log(resp);
}, function (err) {
    console.log('36kr failed')
    console.log(err)
});

