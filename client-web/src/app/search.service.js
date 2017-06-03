"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var config_1 = require("./config");
var blink_item_1 = require("./blink-item");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/do");
require("rxjs/add/operator/take");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/distinct");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/reduce");
require("rxjs/add/observable/throw");
var SearchService = (function () {
    function SearchService(http) {
        this.http = http;
    }
    SearchService.prototype.search = function (query) {
        var _this = this;
        var queryStringParams = { "api-version": "2015-02-28" };
        var requestHeaders = new http_1.Headers({ "api-key": config_1.config.searchAuthKey });
        queryStringParams["search"] = query + '*';
        var qs = this.createQsString(queryStringParams);
        //let requestUrl = "assets/search.service.mockdata.json";
        var requestUrl = config_1.config.searchServiceUrl + "/indexes/" + config_1.config.searchIndexName + "/docs?" + qs;
        return this.http.get(requestUrl, { headers: requestHeaders })
            .map(function (response) { return response.json().value.map(function (item) { return _this.jsonToBlinkItem(item); }); })["catch"](this.handleError);
    };
    SearchService.prototype.submit = function (link) {
        var requestHeaders = new http_1.Headers({ "x-functions-clientid": config_1.config.serverAuthKey });
        var requestUrl = config_1.config.serverUrl + "/links?code=" + config_1.config.serverAuthKey;
        return this.http.post(requestUrl, link, { headers: requestHeaders })
            .map(function (response) { return response.json(); })["catch"](this.handleError);
    };
    SearchService.prototype.update = function (link) {
        var requestHeaders = new http_1.Headers({ "x-functions-clientid": config_1.config.serverAuthKey });
        var requestUrl = config_1.config.serverUrl + "/links/" + link.id + "?code=" + config_1.config.serverAuthKey;
        return this.http.put(requestUrl, link, { headers: requestHeaders })
            .map(function (response) { return response.json(); })["catch"](this.handleError);
    };
    SearchService.prototype.lookup = function (id) {
        var _this = this;
        var queryStringParams = { "api-version": "2015-02-28" };
        var requestHeaders = new http_1.Headers({ "api-key": config_1.config.searchAuthKey });
        var qs = this.createQsString(queryStringParams);
        var requestUrl = config_1.config.searchServiceUrl + "/indexes/" + config_1.config.searchIndexName + "/docs/" + id + "?" + qs;
        return this.http.get(requestUrl, { headers: requestHeaders })
            .map(function (response) { return _this.jsonToBlinkItem(response.json()); })["catch"](this.handleError);
    };
    SearchService.prototype.searchTags = function (query) {
        var queryStringParams = { "api-version": "2015-02-28" };
        var requestHeaders = new http_1.Headers({ "api-key": config_1.config.searchAuthKey });
        queryStringParams["search"] = query + '*';
        queryStringParams["searchFields"] = "tags";
        queryStringParams["select"] = "tags";
        var qs = this.createQsString(queryStringParams);
        //let requestUrl = "assets/search.service.mocktags.json";
        var requestUrl = config_1.config.searchServiceUrl + "/indexes/" + config_1.config.searchIndexName + "/docs?" + qs;
        return this.http.get(requestUrl, { headers: requestHeaders })
            .switchMap(function (response) { return response.json().value; })
            .flatMap(function (value) { return value.tags; })
            .distinct()
            .take(6)
            .reduce(function (acc, curr) { return acc.concat([curr]); }, [])["catch"](this.handleError);
    };
    SearchService.prototype.handleError = function (err) {
        console.log(err);
        return Observable_1.Observable["throw"](err.json().error || 'Server error');
    };
    SearchService.prototype.createQsString = function (dictionary) {
        return Object.keys(dictionary).map(function (property) { return property + "=" + dictionary[property]; }).join('&');
    };
    SearchService.prototype.jsonToBlinkItem = function (json) {
        var tmp = new blink_item_1.BlinkItem();
        if (json.id) {
            tmp.id = json.id;
        }
        if (json.title) {
            tmp.title = json.title;
        }
        if (json.url) {
            tmp.url = json.url;
        }
        if (json.description) {
            tmp.description = json.description;
        }
        if (json.description) {
            tmp.tags = json.description;
        }
        if (json.tags) {
            tmp.tags = json.tags;
        }
        if (json.modified) {
            tmp.modified = json.modified;
        }
        return tmp;
    };
    return SearchService;
}());
SearchService = __decorate([
    core_1.Injectable()
], SearchService);
exports.SearchService = SearchService;
