function test_isCleanDB(db){
    test('db is clean', async ()=>{
        const items = await db.getItems();
        expect(items.length).toBe(0);
    })
}

function test_storeItem(db, id, description, price, skuID, supplierID){
    test('store item', async ()=>{
        const sells = await db.storeItem(id, description, price, skuID, supplierID);
        expect(sells).toBe(true);
    })
}

function test_getItems(db, len){
    test('get list of items', async ()=>{
        const list = await db.getItems();
        expect(list.length).toBe(len);
    })
}


function test_modifyItem(db, id, description, price){
    test('modify item', async ()=>{
        const updated = await db.modifyItem(id, description, price);
        expect(updated).toBe(true);
    })
}

function test_deleteItem(db, id){
    test('delete item', async ()=>{
        const deleted = await db.deleteItem(id);
        expect(deleted).toBe(true);
    })
}

function test_checkSupplierSells(db, supplierID ,skuID ,itemID){
    test('check supplier sells', async ()=>{
        const deleted = await db.checkSupplierSells(supplierID,skuID,itemID);
        expect(deleted).toEqual(
            {description: "item1", 
            itemID: 1, 
            price: 2,
            skuID: 10, 
            supplierID: 11}
        );
    })
}

function test_deleteItems(db) {
    test('delete items', async () => {
        const deleted = await db.deleteItems();
        expect(deleted).toEqual(true);
    })
}


module.exports = {
    test_isCleanDB,
    test_storeItem,
    test_getItems,
    test_modifyItem,
    test_deleteItem,
    test_checkSupplierSells,
    test_deleteItems
}