const DAO = require('../../modules/DataImplementation/DAO')
const SKU = require('../../modules/SKU/SKU');
const SKUItem = require('../../modules/SKUItem/SKUItem');
const test_internalOrder = require('./test_modules/test_internalOrder')


const db = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_internalOrderQuery.sqlite`);

describe('testing internalOrderQuery', () => {
    beforeAll(async () => {
        await db.destroyDB().then(async () => await db.startDB())
    });

    const skus = [];
    skus[0] = new SKU(1, "testing skus", 45, 26, 15, undefined);
    skus[0].setQuantity(10);

    const skus2 = [];
    skus2[0] = new SKU(2, "testing skus", 45, 26, 15, undefined);
    skus2[0].setQuantity(10);

    const skuItemList = [];
    skuItemList.push(new SKUItem("123456789", 1, 1, "04-04-1998"));
    skuItemList.push(new SKUItem("123456787", 1, 2, "04-04-1998"));
    skuItemList.push(new SKUItem("123456788", 1, 3, "04-04-1998"));

    describe('store and get new internal Order', () => {
        beforeAll(async () => {
            await db.deleteInternalOrders();
            await db.deleteAllSkus();
        })
        test_internalOrder.test_dbIsClean(db);
        test_internalOrder.test_newInternalOrder(db,"2023/04/04", 1, skus, 1);
        test_internalOrder.test_storeSku(db,skus[0]);
        test_internalOrder.test_getInternalOrders(db);
    })

    describe('modify internal order', () => {
        beforeAll(async () => {
            await db.deleteInternalOrders();
            await db.deleteAllSkus();
        })
        test_internalOrder.test_dbIsClean(db);
        test_internalOrder.test_storeSku(db,skus[0]);
        test_internalOrder.test_newInternalOrder(db,"2023/04/04", 1, skus, 1);
        test_internalOrder.tets_modifyInternalOrder(db, 1, "COMPLETED", skuItemList)
    })

    describe('get products of internal order', () => {
        beforeAll(async () => {
            await db.deleteInternalOrders();
            await db.deleteAllSkus();
        })
        test_internalOrder.test_dbIsClean(db);
        test_internalOrder.test_storeSku(db,skus[0]);
        test_internalOrder.test_newInternalOrder(db,"2023/04/04", 1, skus, 1);
        test_internalOrder.test_getProductsOfInternalOrder(db, 1, "ISSUED");
    })

    describe('delete internal order', () => {
        beforeAll(async () => {
            await db.deleteInternalOrders();
            await db.deleteAllSkus();
        })
        test_internalOrder.test_dbIsClean(db);
        test_internalOrder.test_storeSku(db,skus[0]);
        test_internalOrder.test_newInternalOrder(db,"2023/04/04", 1, skus, 1);
        test_internalOrder.test_deleteInternalOrder(db, 1);
    })
 
});
