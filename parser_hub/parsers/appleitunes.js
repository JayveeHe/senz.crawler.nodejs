/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('../utils/crawler'),
    Url = require('url'),
    _ = require('underscore'),
    ERRORS = require('../status_code').ERRORS

var Q = require('q')

var FIELD_MAPPING = {
    'name': 'trackName',
    'rateCount': 'userRatingCount',
    'rateValue': function (obj) {
        if (obj.averageUserRating) {
            return parseFloat(obj.averageUserRating) / 5
        }
    },
    'versionizedRateCount': 'userRatingCountForCurrentVersion',
    'versionizedRateValue': function (obj) {
        if (obj.averageUserRatingForCurrentVersion) {
            return parseFloat(obj.averageUserRatingForCurrentVersion) / 5
        }
    },
    'description': 'description',
    'category': function (obj) {
        return obj.genres
    },
    'productSite': function (obj) {
        if (obj.sellerUrl) {
            var sellerUrl = Url.parse(obj.sellerUrl)
            obj.productSite = sellerUrl.hostname
        } else {
            obj.productSite = obj.bundleId
        }
        if (_.contains(Crawler.HOST_WITH_MULTIPLE_APPS, obj.productSite)) {
            obj.productSite += obj.pathname
        }
        return obj.productSite
    },
    'appstore': function () {
        return 'itunes'
    },
    'tags': function () {
        return ['ios']
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 36
    }
}

exports.do = function (url) {
    var deferred = Q.defer();
    //var pid = url.match(
    //        new RegExp("id(\d+)")
    //        //new RegExp(this.api.get('urlPattern'))
    //    )[1]
    var temp_match = url.match(
        new RegExp("id(\d+)")
        //new RegExp(this.api.get('urlPattern'))
    )
    if (!temp_match) {
        deferred.reject(ERRORS.PARSER_INVALID_URL(url))
        return deferred.promise
    }
    var pid = temp_match[1]
    Crawler.getJSON({
        url: 'http://itunes.apple.com/lookup?id=' + pid
    }).then(function (body) {
        if (body.resultCount && body.resultCount > 0) {
            deferred.resolve(Crawler.renameFields(body.results[0], FIELD_MAPPING))
            //response.success(Crawler.renameFields(body.results[0], FIELD_MAPPING))
            //response.success(body)
        } else {
            deferred.reject(ERRORS.PARSER_PARSING_NOT_EXISTS(url))
            //response.error(ERRORS.PARSER_PARSING_NOT_EXISTS(url))
        }
        //??????????
        //response.success(body)
    }, function (err) {
        deferred.reject(err)
        //response.error(err)
    })
    return deferred.promise;
}