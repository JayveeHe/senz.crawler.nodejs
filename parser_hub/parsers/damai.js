/**
 * Created by fengxiaoping on 4/13/15.
 */

var Url = require('url');
var _ = require('underscore');
cheerio = require('cheerio');
var Q = require('q');
var ERRORS = require('../status_code').ERRORS;
var AV = require('leanengine');
var APP_ID = 'h7hukju9tphinijtszrpfk939im8b5br1mwpm7jejxpnusjm';
var APP_KEY = 'xtofbaro5h1m933exesvqw5lvxfl8qwpn1kr5fpb8m1usmnb';
var MASTER_KEY = 'ztt4ikjzckrkgczxlvp1hboz6zgzz78aivfy3b73u7pjhuqc';

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();

var sendHttpRequest = function (options) {
    console.log(options.pathname);
    var promise = new AV.Promise();
    AV.Cloud.httpRequest({
        method: options.method,
        url: options.pathname
    }).then(function (response) {
        var result = undefined;
        try {
            var result = {};
            var $ = cheerio.load(response.text);
            result.title = $('title').text().trim();
            //result.time = $('div[class=ct] span[class=txt]').text().trim();
            result.begin_time = $('#firstperform').attr('data-performtime');
            result.location = $('p[class=txt] a').text().trim();
            var category_org = $('p[class=m-crm] a');
            //for (var j = 0; j < category_org.length; j++) {
            //    console.log(category_org[j].children[0].data)
            //}
            result.category = category_org[2].children[0].data;
            //console.log(.text());
            var ttt = $('div[id=priceList] div ul li a span');
            var t_ticket = '';
            for (var i = 0; i < ttt.length; i++) {
                //console.log(ttt[i].children[0].data);
                t_ticket += (ttt[i].children[0].data + ' ');
            }
            result.ticket = t_ticket;
            map_src = $('#showVenueMap').attr('map-src');
            var m_result = map_src.match(
                new RegExp('y:([0-9.]+),x:([0-9.]+)'));
            if (m_result) {
                var y = parseFloat(m_result[1]);
                var x = parseFloat(m_result[2]);
                if (y > x) {
                    var temp = y;
                    y = x;
                    x = temp;
                }
                //var point = new AV.GeoPoint({latitude: m_result[1], longitude: m_result[2]});
                result.geo = {'latitude': y, 'longitude': x};
            } else {
                result.geo = null;
            }
            //console.log(result.location);
            promise.resolve(result);
        } catch (e) {
            promise.reject({code: 500, msg: 'result parse failed'});
        }
        //return promise;

    }, function (error) {
        //对象保存失败，处理 error
        console.log('error');
        console.log(error);
        promise.reject({code: 500, msg: 'error result parse failed'})
        //return promise;
    });
    return promise;
};

exports.do = function (url) {
    var deferred = Q.defer();
    var temp_match = url.match(
        new RegExp('/([0-9]+)')
        //new RegExp(this.api.get('urlPattern'))
    );
    if (!temp_match) {
        deferred.reject(ERRORS.PARSER_INVALID_URL(url));
        return deferred.promise;
    }


    var activityId = temp_match[1];
    sendHttpRequest({
        method: 'GET',
        pathname: 'http://item.damai.cn/' + activityId + '.html'
    }).then(function (item) {
        deferred.resolve(item);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

