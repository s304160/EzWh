"use strict"
const DAO = require('../../modules/DataImplementation/DAO');
const Position = require('../../modules/Position/Position');
const SKU = require('../../modules/SKU/SKU');

const test_sku = require('./test_modules/test_sku');
const test_position = require('./test_modules/test_position');

const skuDB = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_sku.sqlite`);

describe('SKU tests', ()=>{
    beforeAll(async ()=>{
        await skuDB.destroyDB().then(await skuDB.startDB())
    })

    const sku1 = new SKU(1,"testing sku",45, 26, 15, undefined);
    const sku2 = new SKU(2,"testing sku",45, 26, 15, undefined);
    
    describe('Store skus',()=>{
        beforeAll(async ()=>{
            await skuDB.deleteAllSkus();
        });
        test_sku.test_isCleanDB(skuDB);
        test_sku.test_storeSku(skuDB,sku1);
        test_sku.test_getSkus(skuDB,1);
        test_sku.test_storeSku(skuDB,sku2);
        test_sku.test_getSkus(skuDB,2);
        test_sku.test_storeSku(skuDB,sku2);
        (async ()=>{await skuDB.deleteAllSkus()})();
    });

    describe('Get skus',()=>{
        beforeAll(async ()=>{
            await skuDB.deleteAllSkus();
        });

        // test_sku.test_isCleanDB(skuDB);
        test_sku.test_storeSku(skuDB,sku1);
        test_sku.test_storeSku(skuDB,sku2);
        test_sku.test_storeSku(skuDB,sku2);
        test_sku.test_getSkus(skuDB,2);
        test_sku.test_getMaxID(skuDB,2);
    })

    describe('modify skus',()=>{
        beforeAll(async ()=>{
            await skuDB.deleteAllSkus();
        });
        
        test_sku.test_isCleanDB(skuDB);
        test_sku.test_storeSku(skuDB,sku1);
        test_sku.test_storeSku(skuDB,sku2);
        test_sku.test_modifySku(skuDB,1,"modified test description",10,20,"new test note",25.99,60);
        
        const position1 = new Position("0000","0000","0001",100,100);
        test_position.test_storePosition(skuDB,position1);
        test_position.test_getPositions(skuDB,1);
        test_sku.test_updateSkuPosition(skuDB,sku1.getID(),position1.getPositionID(),50,50);
        test_position.test_getSKUPosition(skuDB,sku1.getID(),position1.getPositionID())
    })

    describe('delete skus',()=>{
        beforeAll(async ()=>{
            await skuDB.deleteAllSkus();
        });
        test_sku.test_isCleanDB(skuDB);
        test_sku.test_storeSku(skuDB,sku1);
        test_sku.test_storeSku(skuDB,sku2);
        test_sku.test_getSkus(skuDB,2);
        test_sku.test_deleteSKU(skuDB,1);
        test_sku.test_getSkus(skuDB,1);
        test_sku.test_deleteSKU(skuDB,1);
        test_sku.test_getSkus(skuDB,1);
    });

});