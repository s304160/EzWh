const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test test result apis', async () => {
    let skus, skuId1, skuId2;
    let testResults, testResultId1, testResultId2;
    let testDescriptors, testDescriptorId1, testDescriptorId2;
    let testResult1, testResult2, invalidTestResult, testResultTestDescriptorNotExisting, newTestResult, invalidNewTestResult

    before(async () => {
        let sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10 };
        let sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku", price: 15.59, availableQuantity: 50 };
        let testDescriptor1 = { name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1 }
        let testDescriptor2 = { name: "test descriptor 2", procedureDescription: "This test is described by...", idSKU: 2 }


        await agent.post('/api/sku')
            .send(sku1);

        await agent.get('/api/skus')
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId1 = (skuId1 > sku.id) ? skuId1 : sku.id });
            });


        await agent.post('/api/sku')
            .send(sku2);

        await agent.get('/api/skus')
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId2 = (skuId2 > sku.id) ? skuId2 : sku.id });
            });


        let skuItem1 = { RFID: "12345678901234567890123456789015", SKUId: skuId1, DateOfStock: "2021/11/29 12:30" }
        let skuItem2 = { RFID: "12345678901234567890123456789016", SKUId: skuId2, DateOfStock: "2021/11/29 12:30" }

        await agent.post('/api/skuitem')
            .send(skuItem1);

        await agent.post('/api/skuitem')
            .send(skuItem2);




        await agent.post('/api/testDescriptor')
            .send(testDescriptor1);

        await agent.get('/api/testDescriptors')
            .then((res) => {
                testDescriptors = res.body;
                testDescriptors.forEach(t => { testDescriptorId1 = (testDescriptorId1 > t.id) ? testDescriptorId1 : t.id });
            });


        await agent.post('/api/testDescriptor')
            .send(testDescriptor2);

        await agent.get('/api/testDescriptors')
            .then((res) => {
                testDescriptors = res.body;
                testDescriptors.forEach(t => { testDescriptorId2 = (testDescriptorId2 > t.id) ? testDescriptorId2 : t.id });
            });




        testResult1 = { rfid: "12345678901234567890123456789015", idTestDescriptor: testDescriptorId1, Date: "2021/11/28", Result: true };
        testResult2 = { rfid: "12345678901234567890123456789016", idTestDescriptor: testDescriptorId2, Date: "2021/11/28", Result: true };

        invalidTestResult = {
            rfid: "12345678901234567890123456789015",
            idTestDescriptor: "id test descriptor",
            Date: 2011,
            Result: "1234"
        }

        testResultTestDescriptorNotExisting = {
            rfid: "12345678901234567890123456789016",
            idTestDescriptor: 999,
            Date: "2021/11/28",
            Result: true
        }

        newTestResult = {
            newIdTestDescriptor: testDescriptorId2,
            newDate: "2021/11/28",
            newResult: true
        }

        invalidNewTestResult = {
            newIdTestDescriptor: testDescriptorId2,
            newDate: 2011,
            newResult: "1234"
        }

        await agent.post('/api/skuitems/testResult')
            .send(testResult1);

        await agent.get('/api/skuitems/12345678901234567890123456789015/testResults')
            .then((res) => {
                testResults = res.body;
                testResults.forEach(t => { testResultId1 = (testResultId1 > t.id) ? testResultId1 : t.id });
            });


        await agent.post('/api/skuitems/testResult')
            .send(testResult1);

        await agent.get('/api/skuitems/12345678901234567890123456789015/testResults')
            .then((res) => {
                testResults = res.body;
                testResults.forEach(t => { testResultId2 = (testResultId2 > t.id) ? testResultId2 : t.id });
            });


    })

    // it('creating test result (unauthorized)', (done)=>{createTestResult(done, 401, "customer", testResult1)});
    it('creating test result (sku not existing)', (done) => { createTestResult(done, 404, "manager", testResultTestDescriptorNotExisting) });
    it('creating test result (invalid)', (done) => { createTestResult(done, 422, "manager", invalidTestResult) });
    it('creating test result (valid)', (done) => { createTestResult(done, 201, "manager", testResult1) });
    it('creating test result (valid)', (done) => { createTestResult(done, 201, "manager", testResult2) });

    // it('getting test results by RFID - (unauthorized)', (done)=>{getTestResultsByRFID(done, 401, "deliveryEmployee", "12345678901234567890123456789015")});
    it('getting test results by RFID - (invalid)', (done) => { getTestResultsByRFID(done, 422, "manager", '!') });
    it('getting test results by RFID - (SKU item not existing)', (done) => { getTestResultsByRFID(done, 404, "manager", "99999678901234567890123456789015") });
    it('getting test results by RFID - (valid)', (done) => { getTestResultsByRFID(done, 200, "manager", "12345678901234567890123456789015") });

    // it('getting single test result by RFID - (unauthorized)', (done)=>{getSkuItemTestResultByID(done, 401, "deliveryEmployee", "12345678901234567890123456789015", testDescriptorId1)});
    it('getting single test result by RFID - (RFID invalid)', (done) => { getSkuItemTestResultByID(done, 422, "manager", '!', testDescriptorId1) });
    it('getting single test result by RFID - (test descriptor invalid)', (done) => { getSkuItemTestResultByID(done, 422, "manager", '12345678901234567890123456789015', "test") });
    it('getting single test result by RFID - (SKU item not existing)', (done) => { getSkuItemTestResultByID(done, 404, "manager", "99999678901234567890123456789015", testResultId1) });
    it('getting single test result by RFID - (test descriptor not existing)', (done) => { getSkuItemTestResultByID(done, 404, "manager", "12345678901234567890123456789015", 999) });
    it('getting single test result by RFID - (valid)', (done) => { getSkuItemTestResultByID(done, 200, "manager", "12345678901234567890123456789015", testResultId1) });

    // it('modifying test result - (unauthorized)', (done)=>{modifyTestResult(done, 401, "deliveryEmployee", "12345678901234567890123456789015", testDescriptorId2, newTestResult)});
    it('modifying test result - (invalid)', (done) => { modifyTestResult(done, 422, "manager", "12345678901234567890123456789015", testDescriptorId2, invalidNewTestResult) });
    it('modifying test result - (test descriptor invalid)', (done) => { modifyTestResult(done, 422, "manager", "12345678901234567890123456789015", "test", newTestResult) });
    it('modifying test result - (RFID invalid)', (done) => { modifyTestResult(done, 422, "manager", "!", testResultId2, newTestResult) });
    it('modifying test result - (test descriptor not existing)', (done) => { modifyTestResult(done, 404, "manager", "12345678901234567890123456789015", 999, newTestResult) });
    it('modifying test result - (RFID not existing)', (done) => { modifyTestResult(done, 404, "manager", "99999678901234567890123456789015", testResultId2, newTestResult) });
    it('modifying test result - (valid)', (done) => { modifyTestResult(done, 200, "manager", "12345678901234567890123456789015", testResultId2, newTestResult) });

    // it('deleting test result - (unauthorized)', (done)=>{deleteTestResult(done, 401, "supplier", "12345678901234567890123456789015", testDescriptorId1)});
    it('deleting test result - (invalid)', (done) => { deleteTestResult(done, 422, "manager", "!", testDescriptorId1) });
    it('deleting test result - (invalid)', (done) => { deleteTestResult(done, 422, "manager", "12345678901234567890123456789015", "test") });
    it('deleting test result - (valid)', (done) => { deleteTestResult(done, 204, "manager", '12345678901234567890123456789015', testDescriptorId1) });
    it('deleting test result - (valid)', (done) => { deleteTestResult(done, 204, "manager", '12345678901234567890123456789016', testDescriptorId2) });


    after(async () => {
        await agent.delete('/api/skus/' + skuId1);
        await agent.delete('/api/skus/' + skuId2);

        await agent.delete('/api/skuitems/12345678901234567890123456789015');
        await agent.delete('/api/skuitems/12345678901234567890123456789016');

        await agent.delete('/api/testDescriptor/' + testDescriptorId1);
        await agent.delete('/api/testDescriptor/' + testDescriptorId2);


        await agent.delete('/api/skuitems/12345678901234567890123456789015/testResult/' + testResultId1);
        await agent.delete('/api/skuitems/12345678901234567890123456789015/testResult/' + testResultId1);
    })

});


function getTestResultsByRFID(done, expectedHTTPStatus, userType, rfid) {
    agent.get('/api/skuitems/' + rfid + '/testResults')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.forEach(t => {
                    t.should.have.all.keys("id", "idTestDescriptor", "Date", "Result");
                });
            }
            done();
        });
};


function getSkuItemTestResultByID(done, expectedHTTPStatus, userType, rfid, id) {
    agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200)
                res.body.should.have.all.keys("id", "idTestDescriptor", "Date", "Result");
            done();
        });
};




function createTestResult(done, expectedHTTPStatus, userType, testResult) {
    agent.post('/api/skuitems/testResult')
        .set("Cookie", "type=".concat(userType))
        .send(testResult)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyTestResult(done, expectedHTTPStatus, userType, rfid, id, newTestResult) {
    agent.put('/api/skuitems/' + rfid + '/testResult/' + id)
        .set("Cookie", "type=".concat(userType))
        .send(newTestResult)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}


function deleteTestResult(done, expectedHTTPStatus, userType, rfid, id) {
    agent.delete('/api/skuitems/' + rfid + '/testResult/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}
