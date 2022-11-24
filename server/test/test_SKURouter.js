const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);



describe('test sku apis', async () => {
    // let positions, position1, position2;
    let sku1, sku2, invalidSku, newSku, invalidNewSku;
    let skuId1 = 0, skuId2 = 0;

    before(async () => {
        let position1 = { positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000 }
        let position2 = { positionID: "800234543413", aisleID: "8002", row: "3454", col: "3413", maxWeight: 1, maxVolume: 1 }

        await agent.post('/api/position')
            .send(position1);

        await agent.post('/api/position')
            .send(position2);


        sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10 };
        sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku", price: 15.59, availableQuantity: 50 };

        invalidSku = {
            description: 1,
            weight: 100,
            volume: "volume",
            notes: "second sku",
            availableQuantity: "quantity",
            price: 15.59
        }


        newSku = {
            newDescription: "a new sku",
            newWeight: 100,
            newVolume: 50,
            newNotes: "first new SKU",
            newPrice: 10.99,
            newAvailableQuantity: 50
        }

        invalidNewSku = {
            newDescription: 123,
            newWeight: 100,
            newVolume: "newVolume",
            newNotes: "first new SKU",
            newPrice: "price",
            newAvailableQuantity: 50
        }



        // before(async () => {
        // it('creating SKU (unauthorized)', (done) => { createSKU(done, 401, "customer", sku1) });
        // it('creating SKU (invalid)', (done) => { createSKU(done, 422, "manager", invalidSku) });
        // it('creating SKU1 (valid)', (done) => { createSKU(done, 201, "manager", sku1) });

        // it('creating SKU1 (valid)', async (done) => { await createSKU(done, 201, "manager", sku1) });
        // it('creating SKU2 (valid)', async (done) => { await createSKU(done, 201, "manager", sku2) });

        await agent.post('/api/sku')
            .send(sku1);

        await agent.get('/api/skus')
            .then((res) => { skus = res.body; });
        await skus.forEach(sku => { skuId1 = (skuId1 > sku.id) ? skuId1 : sku.id });


        await agent.post('/api/sku')
            .send(sku2);

        await agent.get('/api/skus')
            .then((res) => { skus = res.body; });
        await skus.forEach(sku => { skuId2 = (skuId2 > sku.id) ? skuId2 : sku.id });
        // });


    })



    it('creating SKU (invalid)', (done) => { createSKU(done, 422, "manager", invalidSku) });
    // it('creating SKU1 (valid)', (done) => { createSKU(done, 201, "manager", sku1) });

    it('creating SKU1 (valid)', (done) => { createSKU(done, 201, "manager", sku1) });
    it('creating SKU2 (valid)', (done) => { createSKU(done, 201, "manager", sku2) });


    // it('getting SKUs - (unauthorized)', (done) => { getSKUs(done, 401, "supplier") });
    it('getting SKUs - (valid)', (done) => { getSKUs(done, 200, "manager") });

    // it('getting SKU - (unauthorized)', (done) => { getSKUByID(done, 401, "deliveryEmployee", skuId1) });
    it('getting SKU - (invalid)', (done) => { getSKUByID(done, 422, "manager", 'x') });
    it('getting SKU - (SKU not existing)', (done) => { getSKUByID(done, 404, "manager", 999) });
    it('getting SKU - (valid)', (done) => { getSKUByID(done, 200, "manager", skuId1) });

    // it('modifying SKU - (unauthorized)', (done) => { modifySKU(done, 401, "clerk", skuId1, newSku) });
    it('modifying SKU - (invalid)', (done) => { modifySKU(done, 422, "manager", skuId1, invalidNewSku) });
    it('modifying SKU - (SKU not existing)', (done) => { modifySKU(done, 404, "manager", 999, newSku) });
    it('modifying SKU - (valid)', (done) => { modifySKU(done, 200, "manager", skuId1, newSku) });

    // it('modifying SKU position - (unauthorized)', (done) => { modifySKUPosition(done, 401, "clerk", skuId1, { position: "800234543412" }) });
    it('modifying SKU position - (SKU not existing)', (done) => { modifySKUPosition(done, 404, "manager", 999, "800234543412") });
    it('modifying SKU position - (position not existing )', (done) => { modifySKUPosition(done, 404, "manager", skuId1, "123412341234") });
    it('modifying SKU position - (valid)', (done) => { modifySKUPosition(done, 200, "manager", skuId1, "800234543412") });
    it('modifying SKU position - (position already assigned)', (done) => { modifySKUPosition(done, 422, "manager", skuId1, "800234543412") });
    it('modifying SKU position - (position with less max volume/max weight)', (done) => { modifySKUPosition(done, 422, "manager", skuId1, "800234543413") });

    // it('deleting sku (unauthorized)', (done) => { deleteSKU(done, 401, "supplier", skuId1) });
    it('deleting sku1 (valid)', (done) => { deleteSKU(done, 204, "manager", skuId1) });
    it('deleting sku2 (valid)', (done) => { deleteSKU(done, 204, "manager", skuId2) });


    after(async () => {

        await agent.get('/api/skus')
            .set("Cookie", "type=manager")
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => {
                    skuId1 = (skuId1 > sku.id) ? skuId1 : sku.id;
                });

                skuId2 = skuId1 + 1;
            });

        await agent.delete('/api/skus/' + skuId1)
        await agent.delete('/api/skus/' + skuId2)


        await agent.delete('/api/position/800234543412');
        await agent.delete('/api/position/800234543413');
    })

});


function getSKUs(done, expectedHTTPStatus, userType) {
    agent.get('/api/skus')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.be.an('array');
                res.body.forEach(sku => {
                    sku.should.have.all.keys("id", "description", "weight", "volume", "notes", "position", "availableQuantity", "price", "testDescriptors");
                });
            }
            done();
        });
};




function getSKUByID(done, expectedHTTPStatus, userType, id) {
    agent.get('/api/skus/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.have.all.keys("id", "description", "weight", "volume", "notes", "position", "availableQuantity", "price", "testDescriptors");
            }
            done();
        });
};




async function createSKU(done, expectedHTTPStatus, userType, SKU) {
    agent.post('/api/sku')
        .set("Cookie", "type=".concat(userType))
        .send(SKU)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifySKU(done, expectedHTTPStatus, userType, id, newSKU) {
    agent.put('/api/sku/' + id)
        .set("Cookie", "type=".concat(userType))
        .send(newSKU)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifySKUPosition(done, expectedHTTPStatus, userType, id, newPosition) {
    let position = { position: newPosition };
    agent.put('/api/sku/' + id + '/position')
        .set("Cookie", "type=".concat(userType))
        .send(position)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function deleteSKU(done, expectedHTTPStatus, userType, id) {
    agent.delete('/api/skus/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}