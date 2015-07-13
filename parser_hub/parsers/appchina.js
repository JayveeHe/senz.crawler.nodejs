/**
 * Created by fengxiaoping on 12/6/14.
 *
 * Restructure by Jayvee on 7/11/15
 */
var Crawler = require('../utils/crawler');

var Q = require('q');
var ERROR = require('../status_code')
// www.appchina.com/app/aimoxiu.theme.qmtizinw
var APPCHINA_API_ENDPOINT = 'http://www.appchina.com/market/api';

var FIELD_MAPPING = {
    'name': 'name',
    'rateCount': 'ratingCount',
    'rateValue': function (obj) {
        return parseFloat(obj.rating) / 5
    },
    'voteCount': 'likeTimes',
    'hateCount': 'dislikeTimes',
    'downloadCount': 'downloadCount',
    'brief': 'shorDesc',
    'description': 'updateMsg',
    'category': 'categoryName',
    'productSite': 'packageName',
    'appstore': function () {
        return 'itunes'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 3
    }
}

exports.do = function (url) {
    var deferred = Q.defer();
    //var api = this.api,
    var temp_match = url.match(
        new RegExp("app/([a-zA-Z.\d]+)")
        //new RegExp(this.api.get('urlPattern'))
    )
    if (!temp_match) {
        deferred.reject(ERROR.ERRORS.PARSER_INVALID_URL(url))
        return deferred.promise
    }
    var pid = temp_match[1]
    Crawler.postJSON({
        url: APPCHINA_API_ENDPOINT,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: [
            'api=market.AppSpace',
            'key= ',
            'param=' + JSON.stringify({
                "apiVer": 1,
                "guid": "appchinacrawler",
                "type": "detail.adapted",
                "packageName": pid
            })
        ]
    }).then(function (body) {
        deferred.resolve(Crawler.renameFields(body, FIELD_MAPPING));
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};