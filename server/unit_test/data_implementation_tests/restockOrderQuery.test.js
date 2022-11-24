"use strict"
const DAO = require('../../modules/DataImplementation/DAO');
const SKU = require('../../modules/SKU/SKU');
const SKUItem = require('../../modules/SKUItem/SKUItem');
const Item = require('../../modules/Item/Item');
const TestResult = require('../../modules/TestResult/TestResult')
const TransportNote = require('../../modules/RestockOrder/TransportNote')
const test_returnOreder = require('./test_modules/test_returnOrder');
const test_skuItem = require('./test_modules/test_skuItem');
const test_sku = require('./test_modules/test_sku');
const test_item = require('./test_modules/test_item');
const test_restockOrder = require('./test_modules/test_restockOrder');
const test_testResult = require("./test_modules/test_testResult");

const restockOrderDB = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_restockOrder.sqlite`);

describe('restockOrder order tests', () => {
    beforeAll(async () => {
        await restockOrderDB.destroyDB()
            .then(restockOrderDB.startDB())
    })

    //instanciating SKU
    const sku1 = new SKU(1, "testing sku", 45, 26, 15, undefined);
    const sku2 = new SKU(2, "testing sku", 45, 26, 15, undefined);
    const sku3 = new SKU(3, "testing sku", 45, 26, 15, undefined);

    //instanciating SKUItem
    const skuItem1 = new SKUItem("123456789876543210", 0, 1, "1999/04/15 20:20");
    const skuItem2 = new SKUItem("123456789876543211", 0, 2, "1999/04/15 20:20");
    const skuItem3 = new SKUItem("123456789876543212", 0, 3, "1999/04/15 20:20");

    var skuItemList = [skuItem1, skuItem2];
    var skuItemList2 = [skuItem3]

    //instanciating Item
    const item1 = new Item(1, "item1", 2, 10, 11);
    const item2 = new Item(2, "item2", 2, 10, 11);
    item1.setQuantity(10);
    item2.setQuantity(10);

    const items = [item1, item2];

    //instanciating Return order Item
    const roi = [1,2]

    //instanciating TestResult
    const tr1 = new TestResult(1, "1999/04/15", 0, 0);

    //instanciating Transport note
    const transportNote = new TransportNote("2022/01/04 18:18");

    test_sku.test_storeSku(restockOrderDB, sku1);
    test_sku.test_storeSku(restockOrderDB, sku2);
    test_sku.test_storeSku(restockOrderDB, sku3);

    test_skuItem.test_storeSkuItem(restockOrderDB, "123456789876543210", 0, 1, "1999/04/15 20:20");
    test_skuItem.test_storeSkuItem(restockOrderDB, "123456789876543211", 1, 2, "2002/01/26 19:19");
    test_skuItem.test_storeSkuItem(restockOrderDB, "123456789876543212", 1, 3, "2001/01/04 18:18");

    test_item.test_storeItem(restockOrderDB, 1, "item1", 2, 10, 11);
    test_item.test_storeItem(restockOrderDB, 2, "item2", 2, 10, 11);

    test_testResult.test_storeTestResult(restockOrderDB,
        tr1.getID(), "123456789876543210", tr1.getTestDescriptor(), tr1.getDate(), tr1.getResult());

    test_returnOreder.test_storeReturnOrder(restockOrderDB, "04/04/1998", skuItemList, 1, 1);

    test_returnOreder.test_storeReturnOrder(restockOrderDB, "04/04/1998", skuItemList2, 2, 2);

    describe('store and get new resotck Order', () => {
        beforeAll(async () => {
            await restockOrderDB.deleteRestockOrders();
        })
        test_restockOrder.test_isCleanDB(restockOrderDB);
        test_restockOrder.test_storeRestockOrder(restockOrderDB, "1999/04/15 20:20", items, 20, 1);
        test_restockOrder.test_getItemsByRestockOrder(restockOrderDB, 1, items);

    })

    describe('store and get new transport note', () => {
        beforeAll(async () => {
            await restockOrderDB.deleteRestockOrders();
        })
        test_restockOrder.test_isCleanDB(restockOrderDB);
        test_restockOrder.test_storeRestockOrder(restockOrderDB, "1999/04/15 20:20", items, 20, 1);
        test_restockOrder.test_getItemsByRestockOrder(restockOrderDB, 1, items);
        test_restockOrder.test_addRestockOrderTransportNote(restockOrderDB, 1, transportNote.getDeliveryDate());
        test_restockOrder.test_getTransportNote(restockOrderDB, 1);
    })

    describe('modify restock order', () => {
        beforeAll(async () => {
            await restockOrderDB.deleteRestockOrders();
        })
        const items1 = skuItemList.map((s) => { return { rfid: s.getRFID() } });
        test_restockOrder.test_isCleanDB(restockOrderDB);
        test_restockOrder.test_storeRestockOrder(restockOrderDB, "1999/04/15 20:20", items, 20, 1);
        test_restockOrder.test_modifyRestockOrderSKUItems(restockOrderDB, 1, items1);
        test_restockOrder.test_modifyRestockOrderState(restockOrderDB, 1, skuItemList);
        test_restockOrder.test_getReturnItemsOfRestockOrder(restockOrderDB, 1, skuItem1.getRFID(), skuItem1.getSkuID());
    })


    describe('retrieve all info related to a restock order', () => {
        beforeAll(async () => {
            await restockOrderDB.deleteRestockOrders();

        })
        const items1 = skuItemList.map((s) => { return { rfid: s.getRFID() } });
        test_restockOrder.test_isCleanDB(restockOrderDB);
        test_restockOrder.test_storeRestockOrder(restockOrderDB, "1999/04/15 20:20", items, 20, 1);
        test_restockOrder.test_modifyRestockOrderSKUItems(restockOrderDB, 1, items1);
        test_restockOrder.test_modifyRestockOrderState(restockOrderDB, 1, skuItemList);
        test_restockOrder.test_getReturnItemsOfRestockOrder(restockOrderDB, 1, skuItem1.getRFID(), skuItem1.getSkuID(), roi);
        test_restockOrder.test_getReturnItemsOfRestockOrder(restockOrderDB, 1, skuItem1.getRFID(), skuItem1.getSkuID(), roi);
        test_restockOrder.test_getMaxRestockOrderID(restockOrderDB, 4);
        test_restockOrder.test_getSKUItemsByRestockOrder(restockOrderDB, 1, skuItemList);
    })

    describe('delete restock order', () => {
        beforeAll(async () => {
            await restockOrderDB.deleteRestockOrders();
        })
        test_restockOrder.test_isCleanDB(restockOrderDB);
        test_restockOrder.test_deleteRestockOrder(restockOrderDB, 1);
    })





    // test_restockOrder.test_addRestockOrderTransportNote(restockOrderDB, 1, transportNote);

    // test_restockOrder.test_storeRestockOrder( restockOrderDB, "1999/04/15 20:20", items, 20, 2);

    // test_restockOrder.test_getItemsByRestockOrder(restockOrderDB, 1, items);

    // test_restockOrder.test_modifyRestockOrderSKUItems(restockOrderDB, 1, skuItemList);

    // test_restockOrder.test_modifyRestockOrderState(restockOrderDB, 1, skuItemList);

    // test_restockOrder.test_getReturnItemsOfRestockOrder(restockOrderDB, 1, skuItem1.getRFID(), skuItem1.getSkuID());

    // test_restockOrder.test_getTransportNote(restockOrderDB, 1);

    // test_restockOrder.test_getMaxRestockOrderID(restockOrderDB, 2);

    // test_restockOrder.test_getSKUItemsByRestockOrder(restockOrderDB, 1, skuItemList);

    // test_restockOrder.test_deleteRestockOrder( restockOrderDB, 1);

    // test_restockOrder.test_deleteRestockOrder( restockOrderDB, 2);

    // test_restockOrder.test_isCleanDB( restockOrderDB);

});