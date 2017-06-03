var Promise = require('bluebird');
Promise.config({
    cancellation: true
});
var _ = require('underscore');
var common = require('../common/index.js');

module.exports = function (context, req) {
    var doc = _.clone(req.body);
    var p = new Promise(function (resolve, reject) {
        var isValid = common.validateRequired(req.body) ? common.validateFieldUrl(req.body.url) && common.validateFieldId(context.bindingData.id) : false;
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
        doc.id = context.bindingData.id;
        return common.searchAction(doc, "merge");
    }).then(function (searchActionRes) {
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

