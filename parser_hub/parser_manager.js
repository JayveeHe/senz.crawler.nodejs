/**
 * Created by Jayvee on 2015/7/11.
 */

var APPCHINA = require('./parsers/appchina');
var APPLEITUNES = require('./parsers/appleitunes');
var QIHU = require('./parsers/qihu360');
var WANDOUJIA = require("./parsers/wandoujia");
var GOOGLEPLAY = require('./parsers/googleplay');
var KR36 = require('./parsers/kr36next');
var DbCity = require('./parsers/dbcity');
var Damai = require('./parsers/damai');

var ERRORS = require('./status_code').ERRORS;
var Q = require('q');
exports.ParseURL = function (service_name, url) {
    var deferred = Q.defer();
    //var api_pattern = {
    //    "appchina": "www.appchina.com/app/([a-zA-Z.\d]+)",
    //    "appleitunes": "itunes.apple.com/app/id(\d+)",
    //    "googleplay": ""
    //}
    var result;
    switch (service_name) {
        case "app.appchina":
            APPCHINA.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
                //return result;
            }, function (err) {
                deferred.reject(err);
                //return err;
            });
            break;
        case "app.wandoujia":
            WANDOUJIA.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
                //return result;
            }, function (err) {
                deferred.reject(err);
                //return err;
            });
            break;
        case "app.qihu360":
            QIHU.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
                //return result;
            }, function (err) {
                deferred.reject(err);
                //return err;
            });
            break;
        case "app.appleitunes":
            APPLEITUNES.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
                //return result;
            }, function (err) {
                deferred.reject(err);
                //return err;
            });
            break;
        case "app.googleplay":
            GOOGLEPLAY.do(url).then(function (data) {
                result = data;
                //return result;
            }, function (err) {
                //return err;
            });
            break;
        case "app.36kr":
            KR36.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
                //return result;
            }, function (err) {
                deferred.reject(err);
                //return err;
            });
            break;
        case "act.damai":
            Damai.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            break;
        case "act.dbcity":
            DbCity.do(url).then(function (data) {
                result = data;
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            break;
        default :
            deferred.reject(ERRORS.PARSER_INVALID_URL);
    }
    return deferred.promise;
};



