/**
 * Created by fengxiaoping on 12/7/14.
 */

var Crawler = require('../utils/crawler')

var QIHU360_API_ENDPOINT = 'http://openbox.mobilem.360.cn/mintf/getAppInfoByIds'

var ERRORS = require('../status_code').ERRORS
var Q = require('q');

var FIELD_MAPPING = {
    'name': 'name',
    'description': 'brief',
    'productSite': 'apkid',
    'downloadCount': function (obj) {
        return parseInt(obj.download_times)
    },
    'rateValue': function (obj) {
        return parseFloat(obj.rating)
    },
    'tags': function (obj) {
        return obj.list_tag.split(' ')
    },
    'appstore': function () {
        return 'qihu360'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 12
    }
}

exports.do = function (url) {
    var deferred = Q.defer();
    //var url = request.params.url
    var temp_match = url.match(
        /soft_id\/([\d]+)/
    )
    if (!temp_match) {
        deferred.reject(ERRORS.PARSER_INVALID_URL(url))
        return deferred.promise
    }
    var id = temp_match[1]
    Crawler.getJSON({
        url: QIHU360_API_ENDPOINT,
        query: {
            'Charset': 'UTF-8',
            'accept': '*/*',
            'id': id
        }
    }).then(function (body) {
        if (body.total > 0) {
            var result = body.data[0]
            //response.success(
            deferred.resolve(Crawler.renameFields(result, FIELD_MAPPING))
            //)
        } else {
            deferred.reject('None exists application')
            //response.error('None exists application')
        }
    }, function (err) {
        deferred.reject(err);
        //response.error(err)
    })
    return deferred.promise;
}