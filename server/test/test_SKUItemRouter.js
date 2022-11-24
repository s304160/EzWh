const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test skuItem apis', () => {
    let skus, skuId1, skuId2;
    let skuItem1, skuItem2, invalidSkuItem, skuItemSKUNotExisting, newSkuItem, invalidNewSkuItem;

    before(async () => {
        let sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10 };
        let sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku", price: 15.59, availableQuantity: 50 };

        await agent.post('/api/sku/')
            .set("Cookie", "type=manager")
            .send(sku1);

        await agent.get('/api/skus')
            .set("Cookie", "type=manager")
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId1 = (skuId1 > sku.id) ? skuId1 : sku.id });
            });


        await agent.post('/api/sku/')
            .set("Cookie", "type=manager")
            .send(sku2);

        await agent.get('/api/skus')
            .set("Cookie", "type=manager")
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId2 = (skuId2 > sku.id) ? skuId2 : sku.id });
            });

        skuItem1 = {
            RFID: "12345678901234567890123456789015",
            SKUId: skuId1,
            DateOfStock: "2021/11/29 12:30"
        }


        skuItem2 = {
            RFID: "12345678901234567890123456789016",
            SKUId: skuId2,
            DateOfStock: "2021/11/29 12:30"
        }

        invalidSkuItem = {
            RFID: 12345,
            SKUId: skuId1,
            DateOfStock: "date"
        }

        skuItemSKUNotExisting = {
            RFID: "12345678901234567890123456789016",
            SKUId: 999,
            DateOfStock: "2021/11/29 12:30"
        }

        newSkuItem = {
            newRFID: "12345678901234567890123456789017",
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30"
        }

        invalidNewSkuItem = {
            newRFID: "12345678901234567890123456789017",
            newAvailable: "available",
            newDateOfStock: 123
        }
    })


    // it('creating SKU item - (unauthorized)', (done)=>{createSKUItem(done, 401, "customer", skuItem1)});
    it('creating SKU item - (invalid)', (done) => { createSKUItem(done, 422, "manager", invalidSkuItem) });
    it('creating SKU item - (SKU not existing)', (done) => { createSKUItem(done, 404, "manager", skuItemSKUNotExisting) });
    it('creating SKU item - (valid)', (done) => { createSKUItem(done, 201, "manager", skuItem1) });
    it('creating SKU item - (valid)', (done) => { createSKUItem(done, 201, "manager", skuItem2) });

    // it('getting SKU Items - (unauthorized)', (done)=>{getSKUItems(done, 401, "supplier")});
    it('getting SKU Items - (valid)', (done) => { getSKUItems(done, 200, "manager") });

    // it('modifying SKU Item - (unauthorized)', (done)=>{modifySKUItem(done, 401, "clerk", "12345678901234567890123456789015", newSkuItem)});
    it('modifying SKU Item - (invalid)', (done) => { modifySKUItem(done, 422, "manager", "12345678901234567890123456789015", invalidNewSkuItem) });
    it('modifying SKU Item - (SKU not existing)', (done) => { modifySKUItem(done, 404, "manager", "99999678901234567890123456789015", newSkuItem) });
    it('modifying SKU Item - (valid)', (done) => { modifySKUItem(done, 200, "manager", "12345678901234567890123456789015", newSkuItem) });

    // it('getting SKU Items by SKU - (unauthorized)', (done)=>{getSKUItemsBySKUID(done, 401, "deliveryEmployee", skuId1)});
    it('getting SKU Items by SKU - (invalid)', (done) => { getSKUItemsBySKUID(done, 422, "manager", 'x') });
    it('getting SKU Items by SKU - (SKU not existing)', (done) => { getSKUItemsBySKUID(done, 404, "manager", 999) });
    it('getting SKU Items by SKU - (valid)', (done) => { getSKUItemsBySKUID(done, 200, "manager", skuId1) });

    // it('getting SKU Item by RFID - (unauthorized)', (done)=>{getSKUItemByRFID(done, 401, "deliveryEmployee", "12345678901234567890123456789017")});
    it('getting SKU Item by RFID - (invalid)', (done) => { getSKUItemByRFID(done, 422, "manager", "!") });
    it('getting SKU Item by RFID - (RFID not existing)', (done) => { getSKUItemByRFID(done, 404, "manager", "99999678901234567890123456789015") });
    it('getting SKU Item by RFID - (valid)', (done) => { getSKUItemByRFID(done, 200, "manager", "12345678901234567890123456789017") });

    // it('deleting sku item - (unauthorized)', (done)=>{deleteSKUItem(done, 401, "supplier", "12345678901234567890123456789017")});
    it('deleting sku item - (invalid)', (done) => { deleteSKUItem(done, 422, "manager", "!") });
    it('deleting sku item - (valid)', (done) => { deleteSKUItem(done, 204, "manager", "12345678901234567890123456789017") });
    it('deleting sku item - (valid)', (done) => { deleteSKUItem(done, 204, "manager", "12345678901234567890123456789016") });


    after(async () => {
        await agent.delete('/api/skus/' + skuId1)
            .set("Cookie", "type=manager");

        await agent.delete('/api/skus/' + skuId2)
            .set("Cookie", "type=manager")
    })

});




function getSKUItems(done, expectedHTTPStatus, userType) {
    agent.get('/api/skuitems')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.be.an('array');
                res.body.forEach(sku => {
                    sku.should.have.all.keys("RFID", "SKUId", "Available", "DateOfStock");
                });
            }
            done();
        });
};



function getSKUItemsBySKUID(done, expectedHTTPStatus, userType, SKUId) {
    agent.get('/api/skuitems/sku/' + SKUId)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200 && res.body.length != 0) {
                res.body.forEach(skuItem => {
                    skuItem.should.contain.all.keys("RFID", "SKUId", "DateOfStock");
                });
            }
            done();
        });
};


function getSKUItemByRFID(done, expectedHTTPStatus, userType, rfid) {
    agent.get('/api/skuitems/' + rfid)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.have.all.keys("RFID", "SKUId", "Available", "DateOfStock");
            }
            done();
        });
};




function createSKUItem(done, expectedHTTPStatus, userType, SKUItem) {
    agent.post('/api/skuitem/')
        .set("Cookie", "type=".concat(userType))
        .send(SKUItem)
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifySKUItem(done, expectedHTTPStatus, userType, rfid, newSKUItem) {
    agent.put('/api/skuitems/' + rfid)
        .set("Cookie", "type=".concat(userType))
        .send(newSKUItem)
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}


function deleteSKUItem(done, expectedHTTPStatus, userType, rfid) {
    agent.delete('/api/skuitems/' + rfid)
        .set("Cookie", "type=".concat(userType))
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}
