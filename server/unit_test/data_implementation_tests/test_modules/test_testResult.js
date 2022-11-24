function test_getTestResults(db,len){
    test('get test result list', async()=>{
        const list = await db.getTestResults();
        expect(list.length).toBe(len);
    })
}

function test_getTestResultsByRfid(db,rfid,len){
    test('get test result list by rfid', async()=>{
        const list = await db.getTestResultsByRfid(rfid);
        expect(list.length).toBe(len);
    })
}

function test_storeTestResult(db,resultID,rfid,testDescriptorID,date,result){
    test('store test result', async()=>{
        const maxID = await db.getMaxResultID();
        expect(maxID).toBe(resultID-1);

        const stored = await db.storeTestResult(resultID, rfid,testDescriptorID,date,result);
        expect(stored).toBe(true);
    })
}

function test_modifyTestResult(db,resultID,rfid,newTestDescriptorID, newDate, newResult){
    test('modify test result', async()=>{
        const updated = await db.modifyTestResult(resultID,rfid,newTestDescriptorID, newDate, newResult);
        expect(updated).toBe(true);
    })
}

function test_deleteTestResult(db,resultID,rfid){
    test('delete test result', async()=>{
        const deleted = await db.deleteTestResult(resultID,rfid);
        expect(deleted).toBe(true);
    })
}

function test_deleteTestResults(db,resultID){
    test('delete test results', async()=>{
        const deleted = await db.deleteTestResults(resultID);
        expect(deleted).toBe(true);
    })
}

module.exports = {
    test_getTestResults,
    test_getTestResultsByRfid,
    test_storeTestResult,
    test_modifyTestResult,
    test_deleteTestResult,
    test_deleteTestResults
}