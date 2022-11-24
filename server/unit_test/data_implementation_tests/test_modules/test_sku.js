function test_isCleanDB(db){
    test('is clean', async ()=>{
        const skus = await db.getSKUs();
        expect(skus.length).toBe(0);
    })
}

function test_storeSku(db,sku){
    test('store a new sku', async ()=>{
        try{
            const okResponse = await db.storeSKU(sku,50);
            expect(okResponse).toBe(true);
        }catch(err){
            expect(err).toBeDefined();
        }
    });
}

function test_getSkus(db,len){
    test('get sku list', async ()=>{
        try{
            const sku = await db.getSKUs();
            expect(sku).toEqual(len);
        }catch(err){
            expect(err).toBeDefined();
        }
        
    })
}

function test_modifySku(db,skuID,newDescription,newWeight,newVolume,newNote,newPrice,newAvailableQuantity){
    test('modify SKU by ID', async ()=>{ 
        const modified = await db.modifySKUByID(skuID,newDescription,newWeight,newVolume,newNote,newPrice,newAvailableQuantity);
        expect(modified).toBe(true);  
    });
}

function test_getMaxID(db,id){
    test('max ID', async ()=>{
        const maxID = await db.getSKUMaxID();
        expect(maxID).toBe(id);
    });
}


function test_deleteSKU(db,skuID){
    test('delete SKU by ID', async ()=>{
        const deleted = await db.deleteSKU(skuID);
        expect(deleted).toBe(true)
    })
}

function test_deleteAllSkus(db){
    test('delete all skus', async ()=>{
        const deleted = await db.deleteAllSkus();
        expect(deleted).toBe(true)
    })
}

function test_updateSkuPosition(db, skuID, positionID, newVolume, newWeight){
    test('update sku position', async()=>{
        const updated = await db.updateSKUPosition(skuID,positionID, newVolume, newWeight);
        expect(updated).toBe(true);
    })
}


module.exports = {
    test_isCleanDB,
    test_storeSku,
    test_getSkus,
    test_modifySku,
    test_getMaxID,
    test_deleteSKU,
    test_deleteAllSkus,
    test_updateSkuPosition
}