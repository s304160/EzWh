const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test item apis', () => {
    let skus, skuId1, skuId2, supplierId1;
    let item1, item2, invalidItem, itemSkuNotExisting, itemSameId, itemSameSkuId, newItem, invalidNewItem;

    before(async () => {
        let sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10 };
        let sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku", price: 15.59, availableQuantity: 50 };

        await agent.post('/api/sku/')
            .send(sku1);

        await agent.get('/api/skus')
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId1 = (skuId1 > sku.id) ? skuId1 : sku.id });
            });


        await agent.post('/api/sku/')
            .send(sku2);

        await agent.get('/api/skus')
            .then((res) => {
                skus = res.body;
                skus.forEach(sku => { skuId2 = (skuId2 > sku.id) ? skuId2 : sku.id });
            });



        let supplier1 = {
            username: "user1@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "testpassword",
            type: "supplier"
        }


        await agent.post('/api/newUser')
            .send(supplier1);

        await agent.get('/api/users')
            .then((res) => {
                users = res.body;
            });

        await users.forEach(user => {
            if (user.type == "supplier")
                supplierId1 = (supplierId1 > user.id) ? supplierId1 : user.id

        });


        item1 = { id: 1, description: "item description 1", price: 10, SKUId: skuId1, supplierId: supplierId1 };
        item2 = { id: 2, description: "item description 2", price: 100, SKUId: skuId2, supplierId: supplierId1 };

        itemSkuNotExisting = {
            id: 1,
            description: "item description 2",
            price: 100,
            SKUId: 999,
            supplierId: supplierId1
        }

        invalidItem = {
            id: 4,
            description: "item description 2",
            price: "price",
            SKUId: skuId1,
            supplierId: "supplier"
        }

        itemSameId = {
            id: 1,
            description: "item description 1",
            price: 10,
            SKUId: skuId2,
            supplierId: supplierId1
        };

        itemSameSkuId = {
            id: 5,
            description: "item description 2",
            price: "price",
            SKUId: skuId1,
            supplierId: supplierId1
        }

        newItem = {
            newDescription: "a new sku",
            newPrice: 10.99
        }

        invalidNewItem = {
            newDescription: 12345,
            newPrice: "price"
        }
    })

    // it('creating item (unauthorized)', (done)=>{createItem(done, 401, "customer", item1)});
    it('creating item (sku not existing)', (done) => { createItem(done, 404, "supplier", itemSkuNotExisting) });
    it('creating item (invalid)', (done) => { createItem(done, 422, "supplier", invalidItem) });
    it('creating item 1 (valid)', (done) => { createItem(done, 201, "supplier", item1) });
    it('creating item (invalid - same id, supplier)', (done) => { createItem(done, 422, "supplier", itemSameId) });
    it('creating item (invalid - same SKUId, supplier)', (done) => { createItem(done, 422, "supplier", itemSameSkuId) });
    it('creating item 2 (valid)', (done) => { createItem(done, 201, "supplier", item2) });

    // it('getting items (unauthorized)', (done)=>{getItems(done, 401, "aergaer")});
    it('getting items (valid)', (done) => { getItems(done, 200, "manager") });

    // it('getting item - (unauthorized)', (done)=>{getItemByID(done, 401, "deliveryEmployee", item1.id)});
    it('getting item - (invalid)', (done) => { getItemByID(done, 422, "manager", "item id") });
    it('getting item - (item not existing)', (done) => { getItemByID(done, 404, "manager", 999, supplierId1) });
    it('getting item - (supplier not existing)', (done) => { getItemByID(done, 404, "manager", item1.id, 999) });
    it('getting item - (valid)', (done) => { getItemByID(done, 200, "manager", item1.id, supplierId1) });

    // it('modifying item - (unauthorized)', (done)=>{modifyItem(done, 401, "clerk", 1, newItem)});
    it('modifying item - (invalid)', (done) => { modifyItem(done, 422, "supplier", 1, supplierId1, invalidNewItem) });
    it('modifying item - (not existing', (done) => { modifyItem(done, 404, "supplier", 999, supplierId1, newItem) });
    it('modifying item - (valid)', (done) => { modifyItem(done, 200, "supplier", 1, supplierId1, newItem) });

    // it('deleting item (unauthorized)', (done)=>{deleteItem(done, 401, "manager", item1.id)});
    it('deleting item (invalid)', (done) => { deleteItem(done, 422, "supplier", 'x', supplierId1) });
    it('deleting item1 (valid)', (done) => { deleteItem(done, 204, "supplier", item1.id, supplierId1) });
    it('deleting item2 (valid)', (done) => { deleteItem(done, 204, "supplier", item2.id, supplierId1) });


    after(async () => {
        await agent.delete('/api/skus/' + skuId1)
            .set("Cookie", "type=manager");

        await agent.delete('/api/skus/' + skuId2)
            .set("Cookie", "type=manager");

        await agent.delete('/api/users/user1@ezwh.com/supplier');

    })

});




function getItems(done, expectedHTTPStatus, userType) {
    agent.get('/api/items')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.be.an('array');
                res.body.forEach(item => {
                    item.should.have.all.keys("id", "description", "price", "SKUId", "supplierId");
                });
            }
            done();
        });
};




function getItemByID(done, expectedHTTPStatus, userType, id, supplierID) {
    agent.get('/api/items/' + id + "/" + supplierID)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200)
                res.body.should.have.all.keys("id", "description", "price", "SKUId", "supplierId");
            done();
        });
};




function createItem(done, expectedHTTPStatus, userType, item) {
    agent.post('/api/item')
        .set("Cookie", "type=".concat(userType))
        .send(item)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyItem(done, expectedHTTPStatus, userType, id, supplierId1, newItem) {
    agent.put('/api/item/' + id + '/' + supplierId1)
        .set("Cookie", "type=".concat(userType))
        .send(newItem)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}


function deleteItem(done, expectedHTTPStatus, userType, id, supplierId1) {
    agent.delete('/api/items/' + id + '/' + supplierId1)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}