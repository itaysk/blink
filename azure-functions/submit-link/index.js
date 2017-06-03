var Promise = require('bluebird');
Promise.config({
    cancellation: true
});
var _ = require('underscore');
var shortid = require('shortid');
var rp = require('request-promise');
var common = require('../common/index.js');
var settings = require('../settings.js');

module.exports = function (context, req) {
    var doc = _.clone(req.body);
    var p = new Promise(function (resolve, reject) {
        var isValid = common.validateRequired(req.body) ? common.validateFieldUrl(req.body.url) : false;
        resolve(isValid);
    }).then(function (isValid) {
        if (!isValid) {
            context.res = {
                status: 400,
                body: "request validation failed"
            };
            p.cancel();
        }
    }).then(function () {
        return checkExisting(req.body.url);
    }).then(function (duplicate) {
        if (duplicate) {
            context.res = {
                location: duplicate,
                status: 409,
                body: JSON.stringify(duplicate)
            };
            p.cancel();
        }
        else {
            return generateLinkId(req.body.url);
        }
    }).then(function (linkId) {
        doc.id = linkId;
        return common.searchAction(doc, "upload");
    }).then(function (searchActionRes) {
        //no need to check status code becuase they'll be rejected be promise
        context.res = {
            status: 201,
            body: doc
        };
    }).catch(function (err) {
        context.res = {
            body: JSON.stringify(err)
        };
        context.log(err);
    }).finally(function () {
        context.done();
    });
};


function checkExisting(url) {
    function normalizeUrl(url) {
        var s = url;
        //remove protocol of present
        if (s.indexOf("http://") == 0) {
            s = s.substring("http://".length, s.length);
        }
        //remove www host if present
        if (s.indexOf("www.") == 0) {
            s = s.substring("www.".length, s.length);
        }
        //remove tailing slash if present
        if (s.charAt(s.length - 1) == '/') {
            s = s.substring(0, s.length - 2);
        }
        //remove tailing back-slash if present
        if (s.charAt(s.length - 1) == '\\') {
            s = s.substring(0, s.length - 2);
        }
        return s;
    }

    var tmp = url.trim();
    tmp = normalizeUrl(tmp);
    var requestOptions = {
        uri: settings.searchAddress + 'indexes/' + settings.searchIndexName + '/docs',
        qs: {
            "search": '"' + tmp + '"',
            "searchFields": "url",
            "api-version": "2015-02-28"
        },
        headers: {
            "api-key": settings.searchKey
        },
        simple: true,
        transform2xxOnly: true,
        json: true,
        transform: function (body, response) {
            //no need to check status code becuase they'll be rejected be promise
            if (body.value && body.value[0]) {
                return body.value[0];
            } else {
                return null;
            }
        }
    };
    return rp(requestOptions);
}

function generateLinkId(url) {
    return new Promise(function (resolve, reject) {
        var id = shortid.generate();
        //TODO: check for collision?
        resolve(id);
    });
}
