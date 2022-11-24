function test_isCleanDB(db) {
    test('db is clean', async () => {
        const restockOrders = await db.getRestockOrders();
        expect(restockOrders.length).toBe(0);
    })
}

function test_storeRestockOrder(db, issueDate, items, supplierID, newID) {
    test('store restock order', async () => {
        const stored = await db.storeRestockOrder(issueDate, items, supplierID, newID);
        expect(stored).toBe(true);
    })
}

function test_addRestockOrderTransportNote(db, restockOrderID, deliveryDate) {
    test('store transport note', async () => {
        const stored = await db.addRestockOrderTransportNote(restockOrderID, deliveryDate);
        expect(stored).toBe(true);
    })
}

function test_getItemsByRestockOrder(db, restockOrderID, items) {
    test('get items by restock order', async () => {
        const list = await db.getItemsByRestockOrder(restockOrderID);
        var expectedItems = [];
        items.forEach((i) => {
            expectedItems.push(
                {
                    description: i.getDescription(),
                    itemID: i.getID(),
                    price: i.getPrice(),
                    qty: i.getQuantity(),
                    restockOrderID: restockOrderID,
                    skuID: i.getSku(),
                    supplierID: i.getSupplier()
                }
            );
        })
        expect(list).toEqual(expectedItems);
    })
}



function test_getReturnItemsOfRestockOrder(db, restockOrderID, rfid, skuID, roy) {
    test('get return Items of Restock Order', async () => {
        const list = await db.getReturnItemsOfRestockOrder(restockOrderID);
        var expectedList = [];
        list.forEach( item => 
            expectedList.push({itemID: item.itemID, skuID: item.skuID, rfid: item.rfid})
        )
        expect(list).toEqual(expectedList);
    })
}

function test_getSKUItemsByRestockOrder(db, restockOrderID, skuItemList, roi) {
    test('get skuItems by restock order', async () => {
        const list = await db.getSKUItemsByRestockOrder(restockOrderID);

        var expectedSkuItems = [];
        list.forEach( item => 
            expectedSkuItems.push({itemID: item.itemID, skuID: item.skuID, rfid: item.rfid})
        )
        expect(list).toEqual(expectedSkuItems);
    })
}

function test_getTransportNote(db, restockOrderID) {
    test('get transport note of restock order', async () => {
        const note = await db.getTransportNote(restockOrderID);
        expect(note).toEqual(
            { "deliveryDate": "2022/01/04 18:18" }
        );
    })
}

function test_getMaxRestockOrderID(db, expectedId) {
    test('get max restock order ID', async () => {
        const maxId = await db.getMaxRestockOrderID();
        expect(maxId).toBe(expectedId);
    })
}

function test_modifyRestockOrderSKUItems(db, restockOrderID, SKUItems) {
    test('modify SkuItems of restock order', async () => {
        const updated = await db.modifyRestockOrderSKUItems(restockOrderID, SKUItems);
        expect(updated).toBe(true);
    })
}

function test_modifyRestockOrderState(db, restockOrderID, newState) {
    test('modify restock order State', async () => {
        const updated = await db.modifyRestockOrderState(restockOrderID, newState);
        expect(updated).toBe(true);
    })
}

function test_deleteRestockOrder(db, restockOrderId) {
    test('delete restock Order', async () => {
        const deleted = await db.deleteRestockOrder(restockOrderId);
        expect(deleted).toBe(true);
    })
}

function test_deleteRestockOrders(db) {
    test('delete restock Orders', async () => {
        const deleted = await db.deleteRestockOrders();
        expect(deleted).toBe(true);
    })
}


module.exports = {
    test_isCleanDB,
    test_getTransportNote,
    test_getItemsByRestockOrder,
    test_getSKUItemsByRestockOrder,
    test_getReturnItemsOfRestockOrder,
    test_storeRestockOrder,
    test_modifyRestockOrderSKUItems,
    test_modifyRestockOrderState,
    test_addRestockOrderTransportNote,
    test_deleteRestockOrder,
    test_deleteRestockOrders,
    test_getMaxRestockOrderID
}