var AV = require('leanengine');
AV.initialize("h7hukju9tphinijtszrpfk939im8b5br1mwpm7jejxpnusjm", "xtofbaro5h1m933exesvqw5lvxfl8qwpn1kr5fpb8m1usmnb");
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});


module.exports = AV.Cloud;
