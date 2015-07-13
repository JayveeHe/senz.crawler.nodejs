/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('../utils/crawler'),
    _ = require('underscore');

var Q = require('q');
var ERRORS = require('../status_code').ERRORS


var FIELD_MAPPING = {
    'name': 'title',
    'description': 'description',
    'productSite': 'packageName',
    'downloadCount': 'downloadCnt',
    'appstore': function () {
        return 'wandoujia'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 6
    }
};

// http://www.wandoujia.com/apps/com.baidu.BaiduMap
exports.do = function (url) {
    var deferred = Q.defer();
    //var pn = url.match(/\/apps\/([a-zA-Z0-9.]+)/)[1]
    var temp_match = url.match(
        /\/apps\/([a-zA-Z0-9.]+)/
    )
    if (!temp_match) {
        deferred.reject(ERRORS.PARSER_INVALID_URL(url))
        return deferred.promise
    }
    var pn = temp_match[1]
    Crawler.getJSON({
        url: 'http://portal.wandoujia.com/app/detail.json',
        query: {pn: pn}
    }).then(function (body) {
        deferred.resolve(Crawler.renameFields(body, FIELD_MAPPING));
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}