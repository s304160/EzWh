const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test test descriptor apis', () => {
    let skus, skuId1, skuId2;
    let testDescriptors, testDescriptorId1 = 0, testDescriptorId2 = 0;
    let testDescriptor1, testDescriptor2, testDescriptorSKUNotExisting, invalidTestDescriptor, newTestDescriptor, invalidNewTestDescriptor

    before(async () => {
        let sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10 };
        let sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku", price: 15.59, availableQuantity: 50 };


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


        testDescriptor1 = { name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: skuId1 };
        testDescriptor2 = { name: "test descriptor 2", procedureDescription: "This test is described by...", idSKU: skuId2 };

        testDescriptorSKUNotExisting = {
            name: "test descriptor 5",
            procedureDescription: "This test is described by...",
            idSKU: 999
        }

        invalidTestDescriptor = {
            name: 1234,
            procedureDescription: 12345,
            idSKU: skuId1
        }

        newTestDescriptor = {
            newName: "test descriptor 10",
            newProcedureDescription: "This test is described by...",
            newIdSKU: skuId1
        }

        invalidNewTestDescriptor = {
            newName: 12345,
            newProcedureDescription: "This test is described by...",
            newIdSKU: skuId1
        }



        // it('creating test descriptor - (unauthorized)', (done)=>{createTestDescriptor(done, 401, "customer", testDescriptor1)});

        await agent.post('/api/testDescriptor')
            .send(testDescriptor1)

        await agent.get('/api/testDescriptors')
            .then((res) => {
                testDescriptors = res.body;
                testDescriptors.forEach(t => { testDescriptorId1 = (testDescriptorId1 > t.id) ? testDescriptorId1 : t.id });
            });

        await agent.post('/api/testDescriptor')
            .send(testDescriptor1)

        await agent.get('/api/testDescriptors')
            .then((res) => {
                testDescriptors = res.body;
                testDescriptors.forEach(t => { testDescriptorId2 = (testDescriptorId2 > t.id) ? testDescriptorId2 : t.id });
            });


    })


    it('creating test descriptor - (SKU not existing)', (done) => { createTestDescriptor(done, 404, "manager", testDescriptorSKUNotExisting) });
    it('creating test descriptor - (invalid)', (done) => { createTestDescriptor(done, 422, "manager", invalidTestDescriptor) });
    it('creating test descriptor 1 - (valid)', (done) => { createTestDescriptor(done, 201, "manager", testDescriptor1) });
    it('creating test descriptor 2 - (valid)', (done) => { createTestDescriptor(done, 201, "manager", testDescriptor2) });

    // it('getting test descriptors - (unauthorized)', (done) => { getTestDescriptors(done, 401, "supplier") });
    it('getting test descriptors - (valid)', (done) => { getTestDescriptors(done, 200, "manager") });

    // it('getting test descriptor - (unauthorized)', (done) => { getTestDescriptorByID(done, 401, "deliveryEmployee", testDescriptorId1) });
    it('getting test descriptor - (invalid)', (done) => { getTestDescriptorByID(done, 422, "manager", 'x') });
    it('getting test descriptor - (test descriptor not existing)', (done) => { getTestDescriptorByID(done, 404, "manager", 999) });
    it('getting test descriptor - (valid)', (done) => { getTestDescriptorByID(done, 200, "manager", testDescriptorId1) });

    // it('modifying test descriptor - (unauthorized)', (done) => { modifyTestDescriptor(done, 401, "deliveryEmployee", testDescriptorId1, newTestDescriptor) });
    it('modifying test descriptor - (invalid)', (done) => { modifyTestDescriptor(done, 422, "manager", testDescriptorId1, invalidNewTestDescriptor) });
    it('modifying test descriptor - (test descriptor not existing)', (done) => { modifyTestDescriptor(done, 404, "manager", 999, newTestDescriptor) });
    it('modifying test descriptor - (valid)', (done) => { modifyTestDescriptor(done, 200, "manager", testDescriptorId1, newTestDescriptor) });

    // it('deleting test descriptor (unauthorized)', (done) => { deleteTestDescriptor(done, 401, "supplier", testDescriptorId1) });
    it('deleting test descriptor (invalid)', (done) => { deleteTestDescriptor(done, 422, "manager", "testDescriptor") });
    it('deleting test descriptor (valid)', (done) => { deleteTestDescriptor(done, 204, "manager", testDescriptorId1) });
    it('deleting test descriptor (valid)', (done) => { deleteTestDescriptor(done, 204, "manager", testDescriptorId2) });


    after(async () => {

        await agent.delete('/api/testDescriptor/' + testDescriptorId1);
        await agent.delete('/api/testDescriptor/' + testDescriptorId2);

        await agent.delete('/api/skus/' + skuId1);
        await agent.delete('/api/skus/' + skuId2);


    })

});


function getTestDescriptors(done, expectedHTTPStatus, userType) {
    agent.get('/api/testDescriptors')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.be.an('array');
                res.body.forEach(t => {
                    t.should.have.all.keys("id", "name", "procedureDescription", "idSKU");
                });
            }
            done();
        });
};

function getTestDescriptorByID(done, expectedHTTPStatus, userType, id) {
    agent.get('/api/testDescriptors/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.have.all.keys("id", "name", "procedureDescription", "idSKU");
            }
            done();
        });
};



function createTestDescriptor(done, expectedHTTPStatus, userType, testDescriptor) {
    agent.post('/api/testDescriptor')
        .set("Cookie", "type=".concat(userType))
        .send(testDescriptor)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyTestDescriptor(done, expectedHTTPStatus, userType, id, newTestDescriptor) {
    agent.put('/api/testDescriptor/' + id)
        .set("Cookie", "type=".concat(userType))
        .send(newTestDescriptor)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}


function deleteTestDescriptor(done, expectedHTTPStatus, userType, id) {
    agent.delete('/api/testDescriptor/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });

}
