"use strict"
const DAO = require('../../modules/DataImplementation/DAO');
const SKU = require('../../modules/SKU/SKU');
const SKUItem = require('../../modules/SKUItem/SKUItem');
const test_returnOreder = require('./test_modules/test_returnOrder');
const test_skuItem = require('./test_modules/test_skuItem');
const test_sku = require('./test_modules/test_sku');

const returnOrderDB = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_returnOrder.sqlite`);

describe('return order tests', ()=>{
    beforeAll(async ()=>{
        await returnOrderDB.destroyDB()
            .then(returnOrderDB.startDB())
    })

    const sku1 = new SKU(1,"testing sku",45, 26, 15, undefined);
    const sku2 = new SKU(2,"testing sku",45, 26, 15, undefined);
    const sku3 = new SKU(3,"testing sku",45, 26, 15, undefined);

    const skuItem1 = new SKUItem("123456789876543210",0,1,"1999/04/15 20:20");
    const skuItem2 = new SKUItem("123456789876543211",0,2,"1999/04/15 20:20");
    const skuItem3 = new SKUItem("123456789876543212",0,3,"1999/04/15 20:20");
   
    var skuItemList = [skuItem1,skuItem2];
    var skuItemList2 = [skuItem3]

    test_sku.test_storeSku(returnOrderDB, sku1);
    test_sku.test_storeSku(returnOrderDB, sku2);
    test_sku.test_storeSku(returnOrderDB, sku3);

    test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543210",0,1,"1999/04/15 20:20");
    test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543211",1,2,"2002/01/26 19:19");
    test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543212",1,3,"2001/01/04 18:18");

     describe('store and get new return order', () => {
        beforeAll(async () => {
            await returnOrderDB.deleteReturnOrders();
            await returnOrderDB.deleteAllSkus();
            await returnOrderDB.deleteSkuItems();
        })
        test_returnOreder.test_isCleanDB(returnOrderDB);
        test_returnOreder.test_storeReturnOrder(returnOrderDB, "04/04/1998", skuItemList, 1, 1);
        // test_returnOreder.test_getMaxReturnOrderID(returnOrderDB, 1); 
    })

    describe('get products by return order', () => {
        beforeAll(async () => {
            await returnOrderDB.deleteReturnOrders();
            await returnOrderDB.deleteAllSkus();
            await returnOrderDB.deleteSkuItems();
        })
        test_returnOreder.test_isCleanDB(returnOrderDB);
        test_sku.test_storeSku(returnOrderDB, sku1);
        test_sku.test_storeSku(returnOrderDB, sku2);
        test_sku.test_storeSku(returnOrderDB, sku3);
    
        test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543210",0,1,"1999/04/15 20:20");
        test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543211",1,2,"2002/01/26 19:19");
        test_skuItem.test_storeSkuItem(returnOrderDB, "123456789876543212",1,3,"2001/01/04 18:18");
        test_returnOreder.test_storeReturnOrder(returnOrderDB, "04/04/1998", skuItemList, 1, 1);
        test_returnOreder.test_getProductsByReturnOrder(returnOrderDB, 1);
    })


    describe('delete return order', () => {
        beforeAll(async () => {
            await returnOrderDB.deleteReturnOrders();
            await returnOrderDB.deleteAllSkus();
            await returnOrderDB.deleteSkuItems();
        })
        test_returnOreder.test_isCleanDB(returnOrderDB);
        test_returnOreder.test_storeReturnOrder(returnOrderDB, "04/04/1998", skuItemList, 1, 1);
        test_returnOreder.test_deleteReturnOrder(returnOrderDB, 1);
    })



    // test_returnOreder.test_storeReturnOrder(returnOrderDB, "04/04/1998", skuItemList, 1, 1);

    // test_returnOreder.test_getProductsByReturnOrder(returnOrderDB, 1);

    // test_returnOreder.test_storeReturnOrder(returnOrderDB, "04/04/1998", skuItemList2, 2, 2);

    // test_returnOreder.test_getMaxReturnOrderID(returnOrderDB, 2); 

    // test_returnOreder.test_deleteReturnOrder(returnOrderDB, 1);
    // test_returnOreder.test_deleteReturnOrder(returnOrderDB, 2);
   
   

});