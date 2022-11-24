const DAO = require("../../modules/DataImplementation/DAO");
const SKUItem = require("../../modules/SKUItem/SKUItem");

const skuItemDB = new DAO("./unit_test/data_implementation_tests/test_databases/testDB_skuItem.sqlite");
const test_skuItem = require("./test_modules/test_skuItem");
const test_restockOrder = require("./test_modules/test_restockOrder");

describe("SkuItem test", () => {
    beforeAll(async () => {
        await skuItemDB.destroyDB().then(skuItemDB.startDB());
    })
    const skuItem1 = new SKUItem("123456789876543210", 0, 1, "1999/04/15 20:20");
    const skuItem2 = new SKUItem("123456789876543211", 1, 1, "2002/01/26 19:19");
    const skuItem3 = new SKUItem("123456789876543212", 1, 1, "2001/01/04 18:18");

    describe('Store sku Item', () => {
        beforeAll(async () => {
            await skuItemDB.deleteSkuItems();
        });
        test_skuItem.test_getSkuItems(skuItemDB, 0);
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem1.getRFID(), skuItem1.getAvailable(), skuItem1.getSkuID(), skuItem1.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem1.getRFID(), skuItem1.getAvailable(), skuItem1.getSkuID(), skuItem1.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem2.getRFID(), skuItem2.getAvailable(), skuItem2.getSkuID(), skuItem2.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem3.getRFID(), skuItem3.getAvailable(), skuItem3.getSkuID(), skuItem3.getDateOfStock());
        test_skuItem.test_getSkuItems(skuItemDB, 3);
    });

    describe('Get sku items', () => {
        beforeAll(async () => {
            await skuItemDB.deleteSkuItems();
        });
        test_skuItem.test_getSkuItems(skuItemDB, 0);
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem1.getRFID(), skuItem1.getAvailable(), skuItem1.getSkuID(), skuItem1.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem2.getRFID(), skuItem2.getAvailable(), skuItem2.getSkuID(), skuItem2.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem3.getRFID(), skuItem3.getAvailable(), skuItem3.getSkuID(), skuItem3.getDateOfStock());
        test_skuItem.test_getSkuItemsAvailable(skuItemDB, 2);

        test_restockOrder.test_storeRestockOrder(skuItemDB, "1999/04/15", [], 1, 1);
        test_restockOrder.test_modifyRestockOrderSKUItems(skuItemDB, 1, [{ rfid: skuItem1.getRFID() }, { rfid: skuItem2.getRFID() }])
        test_skuItem.test_getSKUItemsByRestockOrder(skuItemDB, 1, 0);

    });

    describe('modify sku items', () => {
        beforeAll(async () => {
            await skuItemDB.deleteSkuItems();
        });
        test_skuItem.test_getSkuItems(skuItemDB, 0);
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem1.getRFID(), skuItem1.getAvailable(), skuItem1.getSkuID(), skuItem1.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem2.getRFID(), skuItem2.getAvailable(), skuItem2.getSkuID(), skuItem2.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem3.getRFID(), skuItem3.getAvailable(), skuItem3.getSkuID(), skuItem3.getDateOfStock());
        test_skuItem.test_modifySkuItem(skuItemDB, skuItem3.getRFID(), "987654321123456789", 0, "2022/05/25 17:17");
        test_skuItem.test_modifySkuItem(skuItemDB, skuItem2.getRFID(), "987654321123456789", 0, "2022/05/25 17:17");
        test_skuItem.test_getSkuItemsAvailable(skuItemDB, 1);
    });

    describe('delete sku items', () => {
        beforeAll(async () => {
            await skuItemDB.deleteSkuItems();
        });
        test_skuItem.test_getSkuItems(skuItemDB, 0);
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem1.getRFID(), skuItem1.getAvailable(), skuItem1.getSkuID(), skuItem1.getDateOfStock());
        test_skuItem.test_storeSkuItem(skuItemDB, skuItem2.getRFID(), skuItem2.getAvailable(), skuItem2.getSkuID(), skuItem2.getDateOfStock());
        test_skuItem.test_deleteSkuItem(skuItemDB, skuItem2.getRFID());
        test_skuItem.test_getSkuItems(skuItemDB, 1);
        test_skuItem.test_deleteSkuItem(skuItemDB, skuItem2.getRFID());
        test_skuItem.test_getSkuItems(skuItemDB, 1);
    });

    // TODO
    // getReturnItemsOfRestockOrder();
})