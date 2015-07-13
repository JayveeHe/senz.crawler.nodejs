/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('../utils/crawler'),
    ERRORS = require('../status_code').ERRORS,
    unirest = require('unirest'),
    _ = require('underscore'),
    cheerio = require('cheerio')

var Q = require('q');

exports.do = function (url) {
    var deferred = Q.defer();
    //var url = request.params.url
    unirest.get(url).end(function (res) {
        if (res.ok === true) {
            var result = {}
            var $ = cheerio.load(res.body);
            result.voteCount = $('.upvote-link span').text().trim()
            result.appstore = '36kr'
            result.commentCount = $('.content .comments h4').text().trim().match(/([0-9]+)/)[0]
            result.name = $('.post-url').text().trim()
            result.brief = $('.post-tagline').text().trim()
            result.hitUrl = 'http://next.36kr.com' + $('.post-url').attr('href')
            result.marks = _.map($('.product-meta .product-mark div'), function (mark) {
                if (mark.attribs.title.indexOf('入驻') > 0) {
                    return 'founder'
                } else if (mark.attribs.title.indexOf('Beta') > 0) {
                    return 'beta'
                } else {
                    return mark.attribs.title
                }
            })
            Crawler.getRedirectLocation(result.hitUrl).then(function (url) {
                result.productSite = (url) ? url.replace('?utm_source=next.36kr.com', '') : result.hitUrl
                deferred.resolve(result)
                //response.success(result)
            }, function (err) {
                deferred.reject(ERRORS.PARSER_PARSING_FETCH_REDIRECT_FAILED(url))
                //response.error(ERRORS.PARSER_PARSING_FETCH_REDIRECT_FAILED(url))
            })
        } else {
            deferred.reject(ERRORS.PARSER_PARSING_FETCH_FAILED(url))
            //response.error(ERRORS.PARSER_PARSING_FETCH_FAILED(url))
        }
    })
    return deferred.promise

}
