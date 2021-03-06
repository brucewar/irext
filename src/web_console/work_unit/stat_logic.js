/**
 * Created by strawmanbobi
 * 2016-11-27
 */

// global inclusion
require('../mini_poem/configuration/constants');
var RequestSender = require('../mini_poem/http/request.js');
var Map = require('../mini_poem/mem/map.js');
var logger = require('../mini_poem/logging/logger4js').helper;

// local inclusion

var Enums = require('../constants/enums.js');
var ErrorCode = require('../constants/error_code.js');

var enums = new Enums();
var errorCode = new ErrorCode();

var REQUEST_APP_KEY = "d6119900556c4c1e629fd92d";
var REQUEST_APP_TOKEN = "fcac5496cba7a12b3bae34abf061f526";

// out going HTTP request parameters
var PRIMARY_SERVER_ADDRESS = "irext.net";
// var PRIMARY_SERVER_ADDRESS = "127.0.0.1";
var PRIMARY_SERVER_PORT = "8200";

var STAT_GENERIC_COUNT_SERVICE = "/irext/stat/generic_count";
var STAT_CATEGORIES_SERVICE = "/irext/stat/stat_categories";
var STAT_BRANDS_SERVICE = "/irext/stat/stat_brands";
var STAT_CITIES_SERVICE = "/irext/stat/stat_cities";

exports.countRemoteWorkUnit = function(statType, callback) {
    if (parseInt(statType) < parseInt(enums.STAT_TYPE_REMOTE_INSTANCE_ACTIVE) ||
        parseInt(statType) > parseInt(enums.STAT_TYPE_REMOTE_ACTIVE)) {
        logger.warn("stat type might be invalid : " + statType);
        callback(errorCode.FAILED, null);
    } else {
        var options = {
            https: false
        };
        var queryParams = new Map();
        var countResult = 0;
        queryParams.put("app_key", REQUEST_APP_KEY);
        queryParams.put("app_token", REQUEST_APP_TOKEN);
        queryParams.put("stat_type", statType);
        var requestSender =
            new RequestSender(PRIMARY_SERVER_ADDRESS, PRIMARY_SERVER_PORT, STAT_GENERIC_COUNT_SERVICE, queryParams);
        requestSender.sendGetRequest(options, function(sendRequestErr, response) {
            if (sendRequestErr != errorCode.SUCCESS.code) {
                logger.error("send request error");
                callback(errorCode.FAILED, null);
            } else {
                logger.info("send request successfully, response = " + JSON.parse(response).entity);
                countResult = JSON.parse(response).entity;
                callback(errorCode.SUCCESS, countResult);
            }
        });
    }
};

exports.statCategoriesWorkUnit = function(callback) {
    var queryParams = new Map();
    queryParams.put("app_key", REQUEST_APP_KEY);
    queryParams.put("app_token", REQUEST_APP_TOKEN);
    var options = {
        https: false
    };

    var messagesResult = null;

    var requestSender =
        new RequestSender(PRIMARY_SERVER_ADDRESS, PRIMARY_SERVER_PORT, STAT_CATEGORIES_SERVICE, queryParams);

    requestSender.sendGetRequest(options, function(sendRequestErr, response) {
        if (sendRequestErr != errorCode.SUCCESS.code) {
            logger.error("send request error");
            callback(errorCode.FAILED, null);
        } else {
            messagesResult = JSON.parse(response).entity;
            callback(errorCode.SUCCESS, messagesResult);
        }
    });
};

exports.statBrandsWorkUnit = function(categoryID, callback) {
    var queryParams = new Map();
    queryParams.put("app_key", REQUEST_APP_KEY);
    queryParams.put("app_token", REQUEST_APP_TOKEN);
    queryParams.put("category_id", categoryID);
    var options = {
        https: false
    };

    var messagesResult = null;

    var requestSender =
        new RequestSender(PRIMARY_SERVER_ADDRESS, PRIMARY_SERVER_PORT, STAT_BRANDS_SERVICE, queryParams);

    requestSender.sendGetRequest(options, function(sendRequestErr, response) {
        if (sendRequestErr != errorCode.SUCCESS.code) {
            logger.error("send request error");
            callback(errorCode.FAILED, null);
        } else {
            messagesResult = JSON.parse(response).entity;
            callback(errorCode.SUCCESS, messagesResult);
        }
    });
};

exports.statCitiesWorkUnit = function(callback) {
    var queryParams = new Map();
    queryParams.put("app_key", REQUEST_APP_KEY);
    queryParams.put("app_token", REQUEST_APP_TOKEN);
    var options = {
        https: false
    };

    var messagesResult = null;

    var requestSender =
        new RequestSender(PRIMARY_SERVER_ADDRESS, PRIMARY_SERVER_PORT, STAT_CITIES_SERVICE, queryParams);

    requestSender.sendGetRequest(options, function(sendRequestErr, response) {
        if (sendRequestErr != errorCode.SUCCESS.code) {
            logger.error("send request error");
            callback(errorCode.FAILED, null);
        } else {
            messagesResult = JSON.parse(response).entity;
            callback(errorCode.SUCCESS, messagesResult);
        }
    });
};