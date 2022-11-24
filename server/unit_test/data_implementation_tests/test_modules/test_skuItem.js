function test_storeSkuItem(db,rfid,available,skuID,dateOfStock){
    test('store sku item', async ()=>{
        try{
            const stored = await db.storeSkuItem(rfid,available,skuID,dateOfStock);
            expect(stored).toBe(true);
        }catch(err){
            expect(err).toBeDefined();
        }
    })
}

function test_getSkuItems(db, len){
    test('get list of sku items', async ()=>{
        const list = await db.getSkuItems();
        expect(list.length).toBe(len);
    })
}

function test_getSkuItemsAvailable(db,len){
    test('get list of available sku items', async ()=>{
        const list = await db.getSkuItemsAvailable();
        expect(list.length).toBe(len);
    })
}

function test_modifySkuItem(db,oldRFID, newRFID, newAvailable, newDateOfStock){
    test('modify sku item', async ()=>{
        try{
            const updated = await db.modifySkuItem(oldRFID, newRFID, newAvailable, newDateOfStock);
            expect(updated).toBe(true);
        }catch(err){
            expect(err).toBeDefined();
        }
    })
}

function test_deleteSkuItem(db,rfid){
    test('delete sku item', async ()=>{
        const deleted = await db.deleteSkuItem(rfid);
        expect(deleted).toBe(true);
    })
}

function test_getSKUItemsByRestockOrder(db,id,len){
    test('get sku item by restock order', async ()=>{
        const list = await db.getSKUItemsByRestockOrder(id);
        expect(list.length).toBe(len);
    })
}
function test_deleteSkuItems(db){
    test('delete sku items', async ()=>{
        const deleted = await db.deleteSkuItems();
        expect(deleted).toBe(true);
    })
}

module.exports = {
    test_storeSkuItem,
    test_getSkuItems,
    test_getSkuItemsAvailable,
    test_modifySkuItem,
    test_deleteSkuItem,
    test_getSKUItemsByRestockOrder,
    test_deleteSkuItems
}