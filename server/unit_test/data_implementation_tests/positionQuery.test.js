"use strict"
const DAO = require("../../modules/DataImplementation/DAO");
const Position = require("../../modules/Position/Position");
const test_position =require('./test_modules/test_position');

const positionDB = new DAO('./unit_test/data_implementation_tests/test_databases/testDB_positions.sqlite');

describe('position test', ()=>{
    beforeAll(async ()=>{
        await positionDB.destroyDB().then(positionDB.startDB())
    });

    const position1 = new Position("0000","0000","0001",100,100);
    const position2 = new Position("0000","0000","0002",100,100);
    const position3 = new Position("0000","0000","0003",100,100);

    describe('Store positions',()=>{
        beforeAll(async ()=>{
            await positionDB.deletePositions();
        });

        test_position.test_isClean(positionDB);
        test_position.test_storePosition(positionDB, position1);
        test_position.test_storePosition(positionDB, position2);
        test_position.test_storePosition(positionDB, position3);
        test_position.test_storePosition(positionDB, position3);
        test_position.test_getPositionByID(positionDB,"000000000001","0000","0000","0001",100,100,0,0,null);
        test_position.test_getPositions(positionDB,3);
    });

    describe('Get position info',()=>{
        beforeAll(async ()=>{
            await positionDB.deletePositions();        
        });
        test_position.test_isClean(positionDB);
        test_position.test_storePosition(positionDB, position1);
        test_position.test_storePosition(positionDB, position2);
        test_position.test_storePosition(positionDB, position3);
        test_position.test_getMaxSpace(positionDB,position1.getPositionID(),100,100);
        test_position.test_getAvailableSpace(positionDB,position1.getPositionID(),100,100);
    });

    describe('modify positions', ()=>{
        beforeAll(async ()=>{
            await positionDB.deletePositions();
            });
        test_position.test_isClean(positionDB);
        test_position.test_storePosition(positionDB, position1);
        test_position.test_storePosition(positionDB, position2);
        test_position.test_storePosition(positionDB, position3);
        test_position.test_updateOccupiedSpace(positionDB,position1.getPositionID(),99,99);
        test_position.test_getAvailableSpace(positionDB,position1.getPositionID(),1,1);
        test_position.test_resetPosition(positionDB,position1.getPositionID());
        test_position.test_getAvailableSpace(positionDB,position1.getPositionID(),100,100);
        test_position.test_modifyPositionByID(positionDB,position2.getPositionID(),"0001","0000","0000",200,200,130,130);
        test_position.test_getPositionByID(positionDB,"000100000000","0001","0000","0000",200,200,130,130,null);

        test_position.test_modifyPositionID(positionDB,position3.getPositionID(),"300000000000");
        test_position.test_getPositionByID(positionDB,"300000000000","3000","0000","0000",100,100,0,0,null);
    });

    describe('delete positions',()=>{
        beforeAll(async ()=>{
            await positionDB.deletePositions();
        });
        test_position.test_isClean(positionDB);
        test_position.test_storePosition(positionDB, position1);
        test_position.test_storePosition(positionDB, position2);
        test_position.test_storePosition(positionDB, position3);
        test_position.test_deletePositionByID(positionDB,"000000000001");
        test_position.test_getPositions(positionDB,2)
        test_position.test_deletePositionByID(positionDB,"300000000000");
        test_position.test_getPositions(positionDB,2)
    });
})
