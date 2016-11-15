/**
 * Created by strawmanbobi
 * 2015-01-23
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var Enums = require('../configuration/enums');

var errorCode = new ErrorCode();
var enums = new Enums();

var Brand = dbOrm.define('brand',
    {
        id: Number,
        name: String,
        category_id: Number,
        category_name: String,
        status: Number,
        create_time: String,
        priority: Number,
        name_en: String,
        name_tw: String,
        input_source: String,
        protector: String
    },
    {
        cache: false
    }
);

Brand.createBrand = function(brand, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newBrand = new Brand({
        name: brand.name,
        category_id: brand.category_id,
        category_name: brand.category_name,
        status: enums.ITEM_VERIFY,
        create_time: date,
        priority: brand.priority,
        name_en: brand.name_en,
        name_tw: brand.name_tw,
        input_source: brand.input_source,
        protector: brand.protector
    });
    newBrand.save(function(error, createdBrand) {
        if(error) {
            logger.error('failed to create brand : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create brand');
            callback(errorCode.SUCCESS, createdBrand);
        }
    });
};

Brand.findBrandByConditions = function(conditions, callback) {
    Brand.find(conditions)
        .run(function (error, brands) {
            if (error) {
                logger.error("find brand error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find brand successfully, length of brands = " + brands.length);
                callback(errorCode.SUCCESS, brands);
            }
        });
};

Brand.listBrands = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Brand.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (listBrandsErr, brands) {
                if (listBrandsErr) {
                    logger.error("list brands error : " + listBrandsErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list brands successfully");
                    callback(errorCode.SUCCESS, brands);
                }
            });
    } else {
        Brand.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (listBrandsErr, brands) {
                if (listBrandsErr) {
                    logger.error("list brands error : " + listBrandsErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list brands successfully");
                    callback(errorCode.SUCCESS, brands);
                }
            });
    }
};

Brand.getBrandByID = function(brandID, callback) {
    Brand.get(brandID, function(error, brand) {
        if (error) {
            logger.error("get brand by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get brand by ID successfully");
            callback(errorCode.SUCCESS, brand);
        }
    });
};

Brand.updateBrandByID = function(brandID, newBrand, callback) {
    Brand.get(brandID, function(error, brand) {
        if (error) {
            logger.error("get brand by ID error in update brand : " + error);
            callback(errorCode.FAILED, null);
        } else {
            brand.name = newBrand.name;
            brand.category_id = newBrand.category_id;
            brand.category_name = newBrand.category_name;
            brand.status = newBrand.status;
            brand.create_time = newBrand.create_time;
            brand.priority = newBrand.priority;
            brand.name_en = newBrand.name_en;
            brand.name_tw = newBrand.name_tw;
            brand.input_source = newBrand.input_source;
            brand.protector = newBrand.protector;

            brand.save(function(error, createdBrand) {
                if(error) {
                    logger.error('failed to create brand in update brand : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update brand');
                    callback(errorCode.SUCCESS, createdBrand);
                }
            });
        }
    });
};

module.exports = Brand;