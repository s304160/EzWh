const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test position apis', () => {

    let position1 = {
        positionID: "800234543412",
        aisleID: "8002",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000
    }


    let position2 = {
        positionID: "800234543413",
        aisleID: "8002",
        row: "3454",
        col: "3413",
        maxWeight: 500,
        maxVolume: 500
    }

    let invalidPosition = {
        positionID: "800234543413",
        aisleID: "802",
        row: "34545",
        col: "13",
        maxWeight: "weight",
        maxVolume: "volume"
    }

    let newPosition = {
        newAisleID: "8002",
        newRow: "3454",
        newCol: "3412",
        newMaxWeight: 1200,
        newMaxVolume: 600,
        newOccupiedWeight: 200,
        newOccupiedVolume: 100
    }

    let invalidNewPosition = {
        newAisleID: "802",
        newRow: "34554",
        newCol: "312",
        newMaxWeight: 1200,
        newMaxVolume: 600,
        newOccupiedWeight: 200,
        newOccupiedVolume: 100
    }

    let newPositionID = {
        newPositionID: "800234543418"
    }

    let invalidNewPositionID = {
        newPositionID: "8002412"
    }


    // it('creating position - (unauthorized)', (done)=>{createPosition(done, 401, "customer", position1)});
    it('creating position - (invalid)', (done) => { createPosition(done, 422, "manager", invalidPosition) });
    it('creating position1 - (valid)', (done) => { createPosition(done, 201, "manager", position1) });
    it('creating position2 - (valid)', (done) => { createPosition(done, 201, "manager", position2) });

    // it('getting positions - (unauthorized)', (done)=>{getPositions(done, 401, "supplier")});
    it('getting positions - (valid)', (done) => { getPositions(done, 200, "manager") });

    // it('modifying position - (unauthorized)', (done)=>{modifyPosition(done, 401, "deliveryEmployee", 800234543412, newPosition)});
    it('modifying position - (invalid)', (done) => { modifyPosition(done, 422, "manager", 800234543412, invalidNewPosition) });
    it('modifying position - (not existing)', (done) => { modifyPosition(done, 404, "manager", 999934543412, newPosition) });
    it('modifying position - (valid)', (done) => { modifyPosition(done, 200, "manager", 800234543412, newPosition) });

    // it('modifying position ID - (unauthorized)', (done)=>{modifyPositionID(done, 401, "deliveryEmployee", 800234543412, newPositionID)});
    it('modifying position ID - (invalid)', (done) => { modifyPositionID(done, 422, "manager", 800234543412, invalidNewPositionID) });
    it('modifying position ID - (position ID not existing)', (done) => { modifyPositionID(done, 404, "manager", 999934543412, newPositionID) });
    it('modifying position ID - (valid)', (done) => { modifyPositionID(done, 200, "manager", 800234543412, newPositionID) });

    // it('deleting position (unauthorized)', (done)=>{deletePosition(done, 401, "supplier", 800234543412)});
    it('deleting position (invalid)', (done) => { deletePosition(done, 422, "manager", "position") });
    it('deleting position (valid)', (done) => { deletePosition(done, 204, "manager", 800234543418) });
    it('deleting position (valid)', (done) => { deletePosition(done, 204, "manager", 800234543413) });

});


function getPositions(done, expectedHTTPStatus, userType) {
    agent.get('/api/positions')
        .set("Cookie", "type=".concat(userType))
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (expectedHTTPStatus == 200) {
                res.body.should.be.an('array');
                res.body.forEach(position => {
                    position.should.have.all.keys("positionID", "aisleID", "row", "col", "maxWeight", "maxVolume", "occupiedWeight", "occupiedVolume");
                });
            }
            done();
        });
};



function createPosition(done, expectedHTTPStatus, userType, position) {
    agent.post('/api/position/')
        .set("Cookie", "type=".concat(userType))
        .send(position)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyPosition(done, expectedHTTPStatus, userType, id, newPosition) {
    agent.put('/api/position/' + id)
        .set("Cookie", "type=".concat(userType))
        .send(newPosition)
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}

function modifyPositionID(done, expectedHTTPStatus, userType, id, newPositionID) {
    agent.put('/api/position/' + id + '/changeID')
        .set("Cookie", "type=".concat(userType))
        .send(newPositionID)
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}


function deletePosition(done, expectedHTTPStatus, userType, id) {
    agent.delete('/api/position/' + id)
        .set("Cookie", "type=".concat(userType))
        .then(function (r) {
            r.should.have.status(expectedHTTPStatus);
            done();
        });
}
