var Promise = require('bluebird');
var _ = require('underscore');
var rp = require('request-promise');
var settings = require('../settings.js');

module.exports.validateRequired = validateRequired;
module.exports.validateFieldUrl = validateFieldUrl;
module.exports.validateFieldId = validateFieldId;
module.exports.checkExisting = checkExisting;
module.exports.searchAction = searchAction;

function validateRequired(body) {
    var isValid = true;
    if (!(body && body.url && body.title)) {
        isValid = false;
    }
    return isValid;
}


function validateFieldUrl(url) {
    var validator = require('validator');

    return validator.isURL(url, {
        require_tld: false,
        require_protocol: false,
        require_valid_protocol: false,
        allow_protocol_relative_urls: false
    });
}

function validateFieldId(id) {
    var shortid = require('shortid');
    return shortid.isValid(id);
}



function checkExisting(url) {
    function normalizeUrl(url) {
        var s = url;
        //remove protocol of present
        if (s.indexOf("http://") === 0) {
            s = s.substring("http://".length, s.length);
        }
        //remove www host if present
        if (s.indexOf("www.") === 0) {
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

function searchAction(doc, action) {
    //prepare payload in Azure Search API format
    doc["@search.action"] = action;
    var payload = { value: [doc] };

    var requestOptions = {
        method: "POST",
        uri: settings.searchAddress + 'indexes/' + settings.searchIndexName + '/docs/index',
        qs: {
            "api-version": "2015-02-28"
        },
        headers: {
            "api-key": settings.searchKey,
            "Content-Type": "application/json; charset=utf-8"
        },
        body: payload,
        simple: true,
        transform2xxOnly: true,
        json: true,
        transform: function (body, response) {
            //no need to check status code becuase they'll be rejected be promise
            if (body.value && body.value[0]) {
                return body.value[0];
            }
            //TODO: else?
        }
    };
    return rp(requestOptions);
}


/* 
new
{
  "@odata.context": "https://itayst1.search.windows.net/indexes('blink')/$metadata#Collection(Microsoft.Azure.Search.V2015_02_28.IndexResult)",
  "value": [
    {
      "key": "ccc",
      "status": true,
      "errorMessage": null
    }
  ]
}

update
{
  "@odata.context": "https://itayst1.search.windows.net/indexes('blink')/$metadata#Collection(Microsoft.Azure.Search.V2015_02_28.IndexResult)",
  "value": [
    {
      "key": "ccc",
      "status": true,
      "errorMessage": null
    }
  ]
}

*/