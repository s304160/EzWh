const Position = require("../../modules/Position/Position");
const PositionManager = require("../../modules/Position/PositionManager");
const dao = require("./mock_dao/mock_positionManager_dao");

const positionManager = new PositionManager(dao);

describe('position Manager test',()=>{
    describe('get positions',()=>{
        beforeEach(()=>{
            dao.getMaxSpace.mockReset();
            dao.getMaxSpace.mockReturnValue(
                {
                    maxVolume:100,
                    maxWeight:100
                }
            );
            dao.getPositions.mockReset();
            dao.getPositions.mockReturnValue(
                [
                    {
                        positionID: "000000000001",
                        aisleID:"0000",
                        aisleRow:"0000",
                        aisleCol:"0001",
                        maxWeight: 1000,
                        maxVolume: 1000,
                        occupiedWeight: 100,
                        occupiedVolume: 100,
                        skuID: 1
                    },
                    {
                        positionID: "000000000002",
                        aisleID:"0000",
                        aisleRow:"0000",
                        aisleCol:"0002",
                        maxWeight: 100,
                        maxVolume: 100,
                        occupiedWeight: 10,
                        occupiedVolume: 10,
                        skuID: 2
                    },
                    {
                        positionID: "000000000003",
                        aisleID:"0000",
                        aisleRow:"0000",
                        aisleCol:"0003",
                        maxWeight: 50,
                        maxVolume: 50,
                        occupiedWeight: 50,
                        occupiedVolume: 50,
                        skuID: 3
                    }
                ]
            );
        });
        
        test('is available', async()=>{
            const case1 = await positionManager.isAvailable("000000000001",99,99);
            expect(case1).toBe(true);
            const case2 = await positionManager.isAvailable("000000000001",100,100);
            expect(case2).toBe(true);
            const case3 = await positionManager.isAvailable("000000000001",101,101);
            expect(case3).toBe(false);
            const case4 = await positionManager.isAvailable("000000000001",101,99);
            expect(case4).toBe(false); 
        });

        test('get all positions',async()=>{
            const p1 = new Position("0000","0000","0001",1000,1000);
            p1.setSkuID(1);
            p1.setOccupiedVolume(100);
            p1.setOccupiedWeight(100);
            const p2 = new Position("0000","0000","0002",100,100);
            p2.setSkuID(2);
            p2.setOccupiedVolume(100);
            p2.setOccupiedWeight(100);
            const p3 = new Position("0000","0000","0003",50,50);
            p3.setSkuID(3);
            p3.setOccupiedVolume(50);
            p3.setOccupiedWeight(50); 
            const pos = [p1,p2,p3];

            const positions = await positionManager.getPositions();
            expect(positions).toStrictEqual(pos);
        });

        test('get position by ID', async ()=>{
            const p3 = new Position("0000","0000","0003",50,50);
            p3.setSkuID(3);
            p3.setOccupiedVolume(50);
            p3.setOccupiedWeight(50);

            const pos = await positionManager.getPositionByID("000000000003");
            expect(pos.toJSON()).toEqual(p3.toJSON());
        })

    });

    describe('modify position', ()=>{
        test('update occupied space', async()=>{
            await positionManager.updateOccupiedSpace("000000000001",100,100);
            expect(dao.updateOccupiedSpace.mock.calls[0][0]).toBe("000000000001");
            expect(dao.updateOccupiedSpace.mock.calls[0][1]).toBe(100);
            expect(dao.updateOccupiedSpace.mock.calls[0][2]).toBe(100);
        });

        test('modify position by ID',async ()=>{
            await positionManager.modifyPositionByID(
                "000000000001","0000","0000","0001",
                100,100,50,50
            );
            expect(dao.modifyPositionByID.mock.calls[0][0]).toBe("000000000001");
            expect(dao.modifyPositionByID.mock.calls[0][1]).toBe("0000");
            expect(dao.modifyPositionByID.mock.calls[0][2]).toBe("0000");
            expect(dao.modifyPositionByID.mock.calls[0][3]).toBe("0001");
            expect(dao.modifyPositionByID.mock.calls[0][4]).toBe(100);
            expect(dao.modifyPositionByID.mock.calls[0][5]).toBe(100);
            expect(dao.modifyPositionByID.mock.calls[0][6]).toBe(50);
            expect(dao.modifyPositionByID.mock.calls[0][7]).toBe(50);
        });
        
        test('modify position ID',async ()=>{
            await positionManager.modifyPositionID("000000000001","000000000002");
            expect(dao.modifyPositionID.mock.calls[0][0]).toBe("000000000001");
            expect(dao.modifyPositionID.mock.calls[0][1]).toBe("000000000002"); 
        });
    });

    describe('store position', ()=>{
        test('store position', async()=>{
            await positionManager.storePosition("000000000001","0000","0000","0001",100,100);
            expect(dao.storePosition.mock.calls[0][0]).toBe("000000000001");
            expect(dao.storePosition.mock.calls[0][1]).toBe("0000");
            expect(dao.storePosition.mock.calls[0][1]).toBe("0000");
            expect(dao.storePosition.mock.calls[0][3]).toBe("0001");
            expect(dao.storePosition.mock.calls[0][4]).toBe(100);
            expect(dao.storePosition.mock.calls[0][5]).toBe(100);
        })
    });

    describe("delete position", ()=>{
        test("delete by ID", async ()=>{
            await positionManager.deletePositionByID("000000000001");
            expect(dao.deletePositionByID.mock.calls[0][0]).toBe("000000000001");
        })
    })
});