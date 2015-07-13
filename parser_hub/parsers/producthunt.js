/**
 * Created by fengxiaoping on 12/7/14.
 */
var Crawler = require('../utils/crawler'),
    ERRORS = require('../status_code').ERRORS,
    unirest = require('unirest'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    Url = require('url')
var Q = require('q')

exports.do = function (url) {
    var deferred = Q.defer();
    unirest.get(url).end(function (res) {
        console.log('page loaded,%s', res)
        if (res.ok === true) {
            var $ = cheerio.load(res.body)
            var result = {}
            result.voteCount = parseInt($('.modal-post--header--upvote .vote-count').text().trim())
            result.appstore = 'producthunt'
            result.name = $('.modal-post--header--title').text().trim()
            result.brief = $('.modal-post--header--tagline').text().trim()
            result.hitUrl = $('.modal-post--header--title a').attr('href').trim()
            console.log('get redirect!')
            Crawler.getRedirectLocation('http://www.producthunt.com' + result.hitUrl)
                .then(function (u) {
                    result.productSite = Url.parse(u).hostname
                    result.commentCount = parseInt($('.modal-post--comments--title').text().replace(' Comments', ''))
                    result.expiredIn = Crawler.MILLSEC_IN_AN_HOUR * 1
                    deferred.resolve(result)
                    //response.success(result)
                }, function () {
                    deferred.reject('get product site failed,%s', result.hitUrl)
                    //response.error('get product site failed,%s', result.hitUrl)
                })
        } else {
            deferred.reject(ERRORS.PARSER_PARSING_FETCH_FAILED(url))
            //response.error(ERRORS.PARSER_PARSING_FETCH_FAILED(url))
        }
    })

}
