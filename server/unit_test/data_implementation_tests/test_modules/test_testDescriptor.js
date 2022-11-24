function test_getSKUTestDescriptors(db,skuID, len){
    test('get SKU test descriptors list', async ()=>{
        const list = await db.getSKUTestDescriptors(skuID);
        expect(list.length).toBe(len);
    })
}

function test_getTestDescriptors(db,len){
    test('get test descriptors list', async ()=>{
        const list = await db.getTestDescriptors();
        expect(list.length).toBe(len);
    })
}

function test_getTDMaxID(db,last){
    test('get the last inserted ID', async ()=>{
        const id = await db.getTDMaxID();
        expect(id).toBe(last);
    })
}

function test_storeTestDescriptor(db,name,procedureDescription, skuID, newID){
    test('store test descriptor', async ()=>{
        const id = await db.getTDMaxID();
        expect(id).toBe(newID-1);
        
        const stored = await db.storeTestDescriptor(name,procedureDescription, skuID, newID);
        expect(stored).toBe(true);
        
    })
}

function test_modifyTestDescriptorByID(db,testDescriptorID,newName,newProcedureDescription,newSkuID){
    test('modify test descriptor', async ()=>{
        const updated = await db.modifyTestDescriptorByID(testDescriptorID,newName,newProcedureDescription,newSkuID);
        expect(updated).toBe(true);
    })
}

function test_deleteTestDescriptor(db,testDescriptorID){
    test('modify test descriptor', async ()=>{
        const deleted = await db.deleteTestDescriptor(testDescriptorID);
        expect(deleted).toBe(true);
    })
}

function test_deleteTestDescriptors(db){
    test('modify test descriptors', async ()=>{
        const deleted = await db.deleteTestDescriptors();
        expect(deleted).toBe(true);
    })
}

module.exports = {
    test_getSKUTestDescriptors,
    test_getTestDescriptors,
    test_getTDMaxID,
    test_storeTestDescriptor,
    test_modifyTestDescriptorByID,
    test_deleteTestDescriptor,
    test_deleteTestDescriptors
}