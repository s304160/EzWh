function test_dbIsClean(db) {
    test('db is clean', async () => {
        const res = await db.getInternalOrders();
        expect(res.length).toStrictEqual(0);
    });
}

function test_newInternalOrder(db, issueDate, customerID, skus, newId) {
    test('create new internal order', async () => {
        const success = await db.storeInternalOrder(issueDate, customerID, skus, newId);
        expect(success).toStrictEqual(true);
    });
}

function test_storeSku(db, sku) {
    test('store a new sku', async () => {
        const okResponse = await db.storeSKU(sku, 50);
        expect(okResponse).toBe(true);
    });
}

function test_getInternalOrders(db) {
    test('get internal orders', async () => {
        const orders = await db.getInternalOrders();
        expect(orders).toEqual(
            [{
                orderID: 1,
                issueDate: "2023/04/04",
                state: "ISSUED",
                customerID: 1
            }]
        );
    })
}

function test_getProductsOfInternalOrder(db, id, state) {
    test('get products of internal order', async () => {
        const orders = await db.getProductsOfInternalOrder(id, state);
        expect(orders).toEqual(
            [{
                skuID: 1,
                description: "testing skus",
                price: 15,
                qty: 10
            }]
        );
    })
}

function test_getMaxInternalOrderID(db) {
    test('get internal order with max id', async () => {
        const orderID = await db.getMaxInternalOrderID();
        expect(orderID).toEqual(2);
    })
}

function tets_modifyInternalOrder(db, orderId, state, skuItemList) {

    test('modify internal order', async () => {
        const updated = await db.modifyInternalOrder(orderId, state, skuItemList);
        expect(updated).toEqual(true);
    })

}

function test_deleteInternalOrder(db, orderId) {
    test('delete internal order', async () => {
        const deleted = await db.deleteInternalOrder(orderId);
        expect(deleted).toEqual(true);
    })
}

function test_deleteInternalOrders(db) {
    test('delete internal orders', async () => {
        const deleted = await db.deleteInternalOrders();
        expect(deleted).toEqual(true);
    })
}

module.exports = {
    test_dbIsClean,
    test_deleteInternalOrder,
    test_getInternalOrders,
    test_getMaxInternalOrderID,
    test_getProductsOfInternalOrder,
    test_newInternalOrder,
    test_storeSku,
    tets_modifyInternalOrder,
    test_deleteInternalOrders
}

