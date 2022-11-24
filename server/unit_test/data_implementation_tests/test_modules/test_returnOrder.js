function test_isCleanDB(db) {
    test('db is clean', async () => {
        const returnOrders = await db.getReturnOrders();
        expect(returnOrders.length).toBe(0);
    })
}

function test_storeReturnOrder(db, returnDate, skuItems, restockOrderID, newID) {
    test('store return order', async () => {
        const stored = await db.storeReturnOrder(returnDate, skuItems, restockOrderID, newID);
        expect(stored).toBe(true);
    })
}

function test_getProductsByReturnOrder(db, returnOrderID) {
    test('get products by return order', async () => {
        const list = await db.getProductsByReturnOrder(returnOrderID);
        expect(list).toEqual(
            []
        );
    })
}


function test_getMaxReturnOrderID(db, expectedId) {
    test('get max return order ID', async () => {
        const maxId = await db.getMaxReturnOrderID();
        expect(maxId).toBe(expectedId);
    })
}

function test_deleteReturnOrder(db, returnOrderId) {
    test('delete return order', async () => {
        const deleted = await db.deleteReturnOrder(returnOrderId);
        expect(deleted).toBe(true);
    })
}

function test_deleteReturnOrders(db) {
    test('delete return orders', async () => {
        const deleted = await db.deleteReturnOrders();
        expect(deleted).toBe(true);
    })
}


module.exports = {
    test_isCleanDB,
    test_getProductsByReturnOrder,
    test_getMaxReturnOrderID,
    test_storeReturnOrder,
    test_deleteReturnOrder,
    test_deleteReturnOrders
}