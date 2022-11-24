const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test user apis', () => {

    let customer = {
        username: "user1@ezwh.com",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "customer"
    }

    let supplier = {
        username: "user2@ezwh.com",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "supplier"
    }

    let clerk = {
        username: "user3@ezwh.com",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "clerk"
    }

    let qualityEmployee = {
        username: "user4@ezwh.com",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "qualityEmployee"
    }

    let deliveryEmployee = {
        username: "user5@ezwh.com",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "deliveryEmployee"
    }

    let manager = {
        username: "manager1@ezwh.com",
        name: "Giuseppe",
        surname: "Micco",
        password: "testpassword",
        type: "manager"
    }

    let invalidUser = {
        username: "user6@ezwh",
        name: "John",
        surname: "Smith",
        password: "testpassword",
        type: "type"
    }



    // it('creating customer (unauthorized)', (done)=>{createUser(done, 401, "customer", customer)});
    it('creating user (invalid)', (done) => { createUser(done, 422, "manager", invalidUser) });
    it('creating customer (valid)', (done) => { createUser(done, 201, "manager", customer) });
    it('creating customer (conflict)', (done) => { createUser(done, 409, "manager", customer) });
    it('creating supplier (valid)', (done) => { createUser(done, 201, "manager", supplier) });
    it('creating clerk (valid)', (done) => { createUser(done, 201, "manager", clerk) });
    it('creating quality employee (valid)', (done) => { createUser(done, 201, "manager", qualityEmployee) });
    it('creating delivery employee (valid)', (done) => { createUser(done, 201, "manager", deliveryEmployee) });

    // it('getting suppliers (unauthorized)', (done)=>{getSuppliers(done, 401, "clerk")});
    it('getting suppliers (valid)', (done) => { getSuppliers(done, 200, "manager") });

    // it('getting users (unauthorized)', (done)=>{getUsers(done, 401, "clerk")});
    it('getting users (valid)', (done) => { getUsers(done, 200, "manager") });

    // it('logging in (unauthorized - wrong username)', (done)=>{session(done, 401, "customer", {username: "customer", password: "testpassword"})});
    // it('logging in (unauthorized - wrong password)', (done)=>{session(done, 401, "customer", {username: "user1@ezwh.com", password: "password"})});
    it('logging in as customer (valid)', (done) => { session(done, 200, "customer", customer) });
    it('logging in as supplier (valid)', (done) => { session(done, 200, "supplier", supplier) });
    it('logging in as clerk (valid)', (done) => { session(done, 200, "clerk", clerk) });
    it('logging in as qualityEmployee (valid)', (done) => { session(done, 200, "qualityEmployee", qualityEmployee) });
    it('logging in as deliveryEmployee (valid)', (done) => { session(done, 200, "deliveryEmployee", deliveryEmployee) });
    it('logging in as manager (valid)', (done) => { session(done, 200, "manager", manager) });

    it('', (done) => { getUserInfo(done, 200, "getting user info (authorized)", "manager") });

    it('', (done) => { logout(done, 200, "logging out", "manager") });

    // it('', (done)=>{getUserInfo(done, 401, "getting user info (unauthorized)")});


    // it('modifying user - (unauthorized', (done)=>{modifyUser(done, 401, "deliveryEmployee", "user4@ezwh.com", { oldType : "qualityEmployee", newType : "clerk" })});
    it('modifying user - (invalid username)', (done) => { modifyUser(done, 422, "manager", "user4", { oldType: "qualityEmployee", newType: "clerk" }) });
    it('modifying user - (invalid new type)', (done) => { modifyUser(done, 422, "manager", "user4@ezwh.com", { oldType: "qualityEmployee", newType: "new type" }) });
    it('modifying user - (invalid old type)', (done) => { modifyUser(done, 422, "manager", "user4@ezwh.com", { oldType: "old type", newType: "clerk" }) });
    it('modifying manager - (invalid)', (done) => { modifyUser(done, 422, "manager", "manager1@ezwh.com", { oldType: "manager", newType: "clerk" }) });
    it('modifying user - (old type not matching)', (done) => { modifyUser(done, 404, "manager", "user4@ezwh.com", { oldType: "deliveryEmployee", newType: "clerk" }) });
    it('modifying user - (user not existing)', (done) => { modifyUser(done, 404, "manager", "user999@ezwh.com", { oldType: "qualityEmployee", newType: "clerk" }) });
    it('modifying user - (valid)', (done) => { modifyUser(done, 200, "manager", "user4@ezwh.com", { oldType: "qualityEmployee", newType: "clerk" }) });

    // it('deleting customer (unauthorized)', (done)=>{deleteUser(done, 401, "supplier", "user1@ezwh.com", "customer")});
    it('deleting manager (invalid)', (done) => { deleteUser(done, 422, "manager", "manager1@ezwh.com", "manager") });
    it('deleting customer (invalid email)', (done) => { deleteUser(done, 422, "manager", "user1", "customer") });
    it('deleting customer (invalid type)', (done) => { deleteUser(done, 422, "manager", "user1@ezwh.com", "type") });
    it('deleting customer (valid)', (done) => { deleteUser(done, 204, "manager", "user1@ezwh.com", "customer") });
    it('deleting supplier (valid)', (done) => { deleteUser(done, 204, "manager", "user2@ezwh.com", "supplier") });
    it('deleting clerk (valid)', (done) => { deleteUser(done, 204, "manager", "user3@ezwh.com", "clerk") });
    it('deleting qualityEmployee (valid)', (done) => { deleteUser(done, 204, "manager", "user4@ezwh.com", "clerk") });
    it('deleting deliveryEmployee (valid)', (done) => { deleteUser(done, 204, "manager", "user5@ezwh.com", "deliveryEmployee") });

});


function getUserInfo(done, expectedHTTPStatus, userType) {

    if (userType == undefined) {
        agent.get('/api/userinfo')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    }
    else {
        agent.get('/api/userinfo')
            .set("Cookie", "type=".concat(userType))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.have.all.keys("id", "username", "name", "surname", "type");
                done();
            });
    }
};


function getSuppliers(done, expectedHTTPStatus, userType) {
    agent.get('/api/suppliers')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.forEach(supplier => {
                    supplier.should.have.all.keys("id", "name", "surname", "email");
                });
            }
            done();
        });
};


function getUsers(done, expectedHTTPStatus, userType) {
    agent.get('/api/users')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.forEach(user => {
                    user.should.have.all.keys("id", "name", "surname", "email", "type");
                    user.type.should.not.equal('manager');
                });
            }
            done();
        });
};


function createUser(done, expectedHTTPStatus, userType, user) {
    agent.post('/api/newUser/')
        .set("Cookie", "type=".concat(userType))
        .send(user)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function session(done, expectedHTTPStatus, userType, credentials) {
    agent.post('/api/' + userType + 'Sessions')
        .send(credentials)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function logout(done, expectedHTTPStatus, userType) {
    agent.post('/api/logout')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyUser(done, expectedHTTPStatus, userType, username, types) {
    agent.put('/api/users/' + username)
        .set("Cookie", "type=".concat(userType))
        .send(types)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function deleteUser(done, expectedHTTPStatus, userType, username, type) {
    agent.delete('/api/users/' + username + '/' + type)
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}
