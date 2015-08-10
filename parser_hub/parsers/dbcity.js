/**
 * Created by fengxiaoping on 4/13/15.
 */

var Url = require('url');
var _ = require('underscore');
cheerio = require('cheerio');
var Q = require('q');
var AV = require('leanengine');
var APP_ID = 'h7hukju9tphinijtszrpfk939im8b5br1mwpm7jejxpnusjm';
var APP_KEY = 'xtofbaro5h1m933exesvqw5lvxfl8qwpn1kr5fpb8m1usmnb';
var MASTER_KEY = 'ztt4ikjzckrkgczxlvp1hboz6zgzz78aivfy3b73u7pjhuqc';

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();
var request = require('request');

var sendHttpRequest = function (options) {
    var promise = new AV.Promise();
    //AV.Cloud.httpRequest({
    //    method: options.method,
    //    url: options.pathname
    //}).then(function (response) {
    //    var result = undefined;
    //    try {
    //        result = {};
    //        temp = JSON.parse(response.text);
    //        //detail = $('div[class=event-detail]');
    //        result.begin_time = temp.begin_time;
    //        result.end_time = temp.end_time;
    //        result.location = temp.address;
    //        result.title = temp.title;
    //        result.category = temp.category_name;
    //        geo_array = temp.geo.split(' ');
    //        result.geo = {'latitude': parseFloat(geo_array[0]), 'longitude': parseFloat(geo_array[1])};
    //        promise.resolve(result);
    //    } catch (e) {
    //        promise.reject({code: 500, msg: 'result parse failed'});
    //    }
    //}, function (error) {
    //    console.log(error);
    //});

    var option = {
        url: options.pathname,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36 SE 2.X MetaSr 1.0',
            'Cookie': 'bid="4Xr9XgH2gMg";' +
            ' viewed="25862578_3133794_3360807_3519369_19952400_11526780_6330498_1834645_25965995_1041482"; ue="jccg2100133@163.com";' +
            ' ct=y; dbcl2="3604515:Rfz7E/eeC28";ck="c_Tx"; ap=1;' +
            ' _pk_ref.100001.f666=%5B%22%22%2C%22%22%2C1438828999%2C%22http%3A%2F%2Fwww.douban.com%2Flocation%2Fworld%2Fevents%2Fweek-all%22%5D; _pk_id.100001.f666=3cf1c6e0ef5b55c4.1436756754.4.1438829174.1438767434.;' +
            '__utma=30149280.1329920929.1389707962.1438842186.1438843526.240; __utmb=30149280.2.10.1438843526; __utmc=30149280; __utmz=30149280.1438843526.240.191.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%27http%3A%2F%2Fwww.douban.com%2Flocation%2Fbeijing%2Fevents%2Ftoday-all%3Fstart%3D0%27;' +
            ' __utmv=30149280.360; ll="108288"; push_noty_num=0; push_doumail_num=15'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = undefined;
            try {
                result = {};
                temp = JSON.parse(body);
                //detail = $('div[class=event-detail]');
                result.begin_time = temp.begin_time;
                result.end_time = temp.end_time;
                result.location = temp.address;
                result.title = temp.title;
                result.category = temp.category_name;
                geo_array = temp.geo.split(' ');
                result.geo = {'latitude': parseFloat(geo_array[0]), 'longitude': parseFloat(geo_array[1])};
                promise.resolve(result);
            } catch (e) {
                promise.reject({code: 500, msg: 'result parse failed'});
            }
        } else {
            console.log(error);
        }
    }

    request(option, callback);
    return promise;
};


exports.do = function (url) {
    var deferred = Q.defer();
    var temp_match = url.match(
        new RegExp('event/([0-9]+)')
        //new RegExp(this.api.get('urlPattern'))
    );
    if (!temp_match) {
        deferred.reject(ERRORS.PARSER_INVALID_URL(url));
        return deferred.promise;
    }
    var activityId = temp_match[1];
    //pathname: 'https://api.douban.com/v2/event/' + activityId
    //pathname: 'http://www.douban.com/event/' + activityId+'/'
    sendHttpRequest({
        method: 'GET',
        pathname: 'https://api.douban.com/v2/event/' + activityId
    }).then(function (item) {
        deferred.resolve(item);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

//module.exports = function () {
//    var sendHttpRequest = function (options) {
//        var promise = new AV.Promise();
//        AV.Cloud.httpRequest({
//            method: options.method,
//            url: options.pathname
//        }).then(function (response) {
//            var result = undefined;
//            try {
//                var result = {}
//                temp = JSON.parse(response.text);
//                result.time = temp.begin_time;
//                result.location = temp.address;
//                result.title = temp.title;
//                promise.resolve(result);
//            } catch (e) {
//                promise.reject({code: 500, msg: 'result parse failed'});
//            }
//
//        }, function (error) {
//            console.log(error);
//        });
//        return promise;
//    }
//
//    var getActivityInfo = function (activityId) {
//        return sendHttpRequest({
//            method: 'GET',
//            pathname: 'https://api.douban.com/v2/event/' + activityId
//        })
//    }
//
//
//    return {
//        getActivityInfo: getActivityInfo
//    }
//}
