const SKU = require("../../modules/SKU/SKU");
const SKUManager = require("../../modules/SKU/SKUManager");
const SKUItem = require("../../modules/SKUItem/SKUItem");
const TestDescriptor = require("../../modules/TestDescriptor/TestDescriptor");
const TestResult = require("../../modules/TestResult/TestResult");

const dao = require("./mock_dao/mock_skuManager_dao")
// const inventory = new Inventory(dao);
const skuManager = new SKUManager(dao);

describe(("sku manager tests"),()=>{
    // SKU TEST
    describe("sku test",()=>{
        beforeEach(()=>{
            dao.getSKUs.mockReset();
            dao.getSKUs.mockReturnValue(
                [{
                    skuID:1,
                    description: "test sku",
                    weight:100,
                    volume:100,
                    price:15.99,
                    notes:"test note",
                    availableQuantity: 50
                }]
            );
            dao.getPositions.mockReturnValue(
                [{
                    positionID: "000000000001",
                    aisleID: "0000",
                    aisleRow: "0000",
                    aisleCol: "0001",
                    maxWeight: 1000,
                    maxVolume: 1000,
                    occupiedWeight: 100,
                    occupiedVolume: 100,
                    skuID:1
                }]
            );
            dao.getTestDescriptors.mockReturnValue(
                [{
                    testDescriptorID:1,
                    name: "test name",
                    procedureDescription: "test description",
                    skuID: 1
                }]
            );
        });

        describe('get sku',()=>{
            beforeAll(()=>{
                dao.getSKUTestDescriptors.mockReturnValue(
                    [{
                        testDescriptorID:1,
                        name: "test name",
                        procedureDescription: "test description",
                        skuID: 1
                    }]
                );
                dao.getSKUPosition.mockReturnValue("000000000001");
            })

            test('get sku list', async ()=>{
                const skus = await skuManager.getSKUs();
                expect(skus[0].toJSON()).toEqual(
                    {
                        id: 1,
                        description: "test sku",
                        weight: 100,
                        volume: 100,
                        price: 15.99,
                        notes: "test note",
                        availableQuantity: 50,
                        position : "000000000001",
                        testDescriptors: [1],
                        qty:undefined
                    }
                )
            });

            test('get sku by ID', async ()=>{
                const sku = await skuManager.getSKUByID(1);
                expect(sku.toJSON()).toEqual(
                    {
                        id: 1,
                        description: "test sku",
                        weight: 100,
                        volume: 100,
                        price: 15.99,
                        notes: "test note",
                        availableQuantity: 50,
                        position : "000000000001",
                        testDescriptors: [1],
                        qty:undefined
                    }
                )
                const sku2 = await skuManager.getSKUByID(2);
                expect(sku2).toBe(undefined)
            });

        });
        
        describe('store sku',()=>{
            beforeAll(()=>{
                dao.getSKUMaxID.mockReturnValue(0);
            });
            
            test('store', async()=>{
                const sku = new SKU(1,"aaa",1,1,1.1,"bbb");
                await skuManager.createSKU("aaa",1,1,"bbb",1.1,2);
                expect(dao.storeSKU.mock.calls[0][0]).toEqual(sku)
                expect(dao.storeSKU.mock.calls[0][1]).toBe(2)
            });
        });

        describe('modify sku',()=>{
            test('modify sku by id', async()=>{
                await skuManager.modifySKUByID(1,"aaa",100,100,"bbb",10.98,50);
                expect(dao.modifySKUByID.mock.calls[0][0]).toBe(1);
                expect(dao.modifySKUByID.mock.calls[0][1]).toBe("aaa");
                expect(dao.modifySKUByID.mock.calls[0][2]).toBe(100);
                expect(dao.modifySKUByID.mock.calls[0][3]).toBe(100);
                expect(dao.modifySKUByID.mock.calls[0][4]).toBe("bbb");
                expect(dao.modifySKUByID.mock.calls[0][5]).toBe(10.98);
                expect(dao.modifySKUByID.mock.calls[0][6]).toBe(50);
            })
        })

        describe('update sku', ()=>{
            test('update sku position', async()=>{
                const sku = new SKU(1,"aaa",1,1,1.1,"bbb");
                sku.setAvailableQuantity(2);
                await skuManager.updateSKUPosition(sku,"000000000001");
                expect(dao.updateSKUPosition.mock.calls[0][0]).toBe(sku.getID());
                expect(dao.updateSKUPosition.mock.calls[0][1]).toBe("000000000001");
                expect(dao.updateSKUPosition.mock.calls[0][2]).toBe(sku.getTotalVolume());
                expect(dao.updateSKUPosition.mock.calls[0][3]).toBe(sku.getTotalWeight());

                sku.setPosition("000000000001")
                await skuManager.updateSKUPosition(sku,"000000000002");
                expect(dao.updateSKUPosition.mock.calls[1][1]).toBe("000000000002");
                expect(dao.resetPosition.mock.calls[0][0]).toBe(sku.getPosition());
            })
        })

        describe('delete sku',()=>{
            test('delete sku by ID', async ()=>{
                await skuManager.deleteSKU(1);
                expect(dao.deleteSKU.mock.calls[0][0]).toBe(1);
                expect(dao.resetPosition.mock.calls[1][0]).toBe("000000000001");

                await skuManager.deleteSKU(30);
                // Check if resetPosition has been called
                expect(dao.resetPosition.mock.calls[2]).toEqual(undefined);
            })
        })
    });

    // SKUITEM TEST
    describe('skuItem test',()=>{
        describe('store sku item',()=>{
            test('store', async ()=>{
                await skuManager.storeSkuItem("123456789987654321",1,1,"1999/04/15");
                expect(dao.storeSkuItem.mock.calls[0][0]).toBe("123456789987654321");
                expect(dao.storeSkuItem.mock.calls[0][1]).toBe(1);
                expect(dao.storeSkuItem.mock.calls[0][2]).toBe(1);
                expect(dao.storeSkuItem.mock.calls[0][3]).toBe("1999/04/15");
            })
        });

        describe('get sku items', ()=>{
            beforeEach(()=>{
                dao.getSkuItems.mockReset();
                dao.getSkuItems.mockReturnValue(
                    [
                        {
                            rfid: "123456789987654321",
                            available: 1,
                            skuID: 1,
                            dateOfStock: "1999/04/01",
                            internalOrderID: 10,
                            restockOrderID: 4,
                            returnOrderID: 5
                        },
                        {
                            rfid: "987654321123456789",
                            available: 0,
                            skuID: 1,
                            dateOfStock: "2000/04/01",
                            internalOrderID: 9,
                            restockOrderID: 7,
                            returnOrderID: 12
                        }
                    ]
                );
                dao.getSkuItemsAvailable.mockReturnValue(
                    [
                        {
                            rfid: "123456789987654321",
                            available: 1,
                            skuID: 1,
                            dateOfStock: "1999/04/01",
                            internalOrderID: 10,
                            restockOrderID: 4,
                            returnOrderID: 5
                        },
                        {
                            rfid: "987654321123456789",
                            available: 1,
                            skuID: 2,
                            dateOfStock: "2000/04/01",
                            internalOrderID: 9,
                            restockOrderID: 7,
                            returnOrderID: 12
                        }
                    ]
                );
            });

            test('get all sku items', async ()=>{
                const si =[
                        new SKUItem("123456789987654321",1,1,"1999/04/01"),
                        new SKUItem("987654321123456789",0,1,"2000/04/01")
                    ];
                const skuItems = await skuManager.getSkuItems();
                expect(skuItems[0].toJSON()).toEqual(si[0].toJSON());
                expect(skuItems[1].toJSON()).toEqual(si[1].toJSON());
            });

            test('get available sku items', async ()=>{
                const si =[
                    new SKUItem("123456789987654321",1,1,"1999/04/01"),
                    new SKUItem("987654321123456789",1,2,"2000/04/01")
                ];
                const skuItems = await skuManager.getSkuItemsAvailable();
                expect(skuItems[0].toJSON()).toEqual(si[0].toJSON());
                expect(skuItems[1].toJSON()).toEqual(si[1].toJSON());
            });

            test('get sku item by rfid', async ()=>{
                const si = new SKUItem("123456789987654321",1,1,"1999/04/01");
                const skuItem = await skuManager.getSkuItemByRfid("123456789987654321");
                expect(skuItem.toJSON()).toEqual(si.toJSON());
            });
        });

        describe('modify sku item', ()=>{
            test('modify', async ()=>{
                const si = new SKUItem("123456789987654321",1,1,"1999/04/01");
                await skuManager.modifySkuItem(si,"987654321123456789",0,"2001/04/01");
                expect(dao.modifySkuItem.mock.calls[0][0]).toEqual(si.getRFID());
                expect(dao.modifySkuItem.mock.calls[0][1]).toEqual("987654321123456789");
                expect(dao.modifySkuItem.mock.calls[0][2]).toEqual(0);
                expect(dao.modifySkuItem.mock.calls[0][3]).toEqual("2001/04/01");
            })
        });

        describe('delete sku item',()=>{
            test('delete by rfid',async ()=>{
                await skuManager.deleteSkuItem("123456789987654321");
                expect(dao.deleteSkuItem.mock.calls[0][0]).toBe("123456789987654321")
            })
        });       
    });

    // TEST DESCRIPTOR
    describe('test descriptor test', ()=>{
        describe('store test descriptor',()=>{
            beforeEach(()=>{
                dao.getTDMaxID.mockReset();
                dao.getTDMaxID.mockReturnValue(0);
            });

            test('store',async ()=>{
                await skuManager.storeTestDescriptor("td name","td procedure",1);
                expect(dao.storeTestDescriptor.mock.calls[0][0]).toBe("td name");
                expect(dao.storeTestDescriptor.mock.calls[0][1]).toBe("td procedure");
                expect(dao.storeTestDescriptor.mock.calls[0][2]).toBe(1);
                expect(dao.storeTestDescriptor.mock.calls[0][3]).toBe(1);
            })
        });

        describe('get test descriptor',()=>{
            beforeEach(()=>{
                dao.getTestDescriptors.mockReset();
                dao.getTestDescriptors.mockReturnValue(
                    [
                        {
                            testDescriptorID: 1,
                            name: "aaa",
                            procedureDescription:"test procedure",
                            skuID:1
                        },
                        {
                            testDescriptorID: 12,
                            name: "bbb",
                            procedureDescription:"test procedure",
                            skuID:4
                        },
                        {
                            testDescriptorID: 98,
                            name: "ccc",
                            procedureDescription:"test procedure",
                            skuID:1
                        }
                    ]
                );
            });
            test('get test descriptors',async ()=>{
                const tds = [
                    new TestDescriptor(1,"aaa","test procedure",1),
                    new TestDescriptor(12,"bbb","test procedure",4),
                    new TestDescriptor(98,"ccc","test procedure",1),
                ]
                const tests = await skuManager.getTestDescriptors();
                expect(tests).toEqual(tds);
            });

            test('get test descriptor by id', async ()=>{
                const td = new TestDescriptor(12,"bbb","test procedure",4);
                const test = await skuManager.getTestDescriptorByID(12);
                expect(test).toEqual(td);
            })
        });

        describe('modify test descriptors', ()=>{
            test('modify by ID',async()=>{
                await skuManager.modifyTestDescriptorByID(12,"aaa","bbb",23)
                expect(dao.modifyTestDescriptorByID.mock.calls[0][0]).toBe(12);
                expect(dao.modifyTestDescriptorByID.mock.calls[0][1]).toBe("aaa");
                expect(dao.modifyTestDescriptorByID.mock.calls[0][2]).toBe("bbb");
                expect(dao.modifyTestDescriptorByID.mock.calls[0][3]).toBe(23);
            });
        });

        describe('delete test descriptors',()=>{
            test('delete by ID', async ()=>{
                await skuManager.deleteTestDescriptor(12);
                expect(dao.deleteTestDescriptor.mock.calls[0][0]).toBe(12);
            });
        });
    });

    // TEST RESULT
    describe('testResult test',()=>{
        describe('store test results',()=>{
            beforeEach(()=>{
                dao.getMaxResultID.mockReset();
                dao.getMaxResultID.mockReturnValue(0);
            });

            test('store',async()=>{
                await skuManager.storeTestResult("123456789987654321",12,"2001/01/04",1);
                expect(dao.storeTestResult.mock.calls[0][0]).toBe(1,"123456789987654321",12,"2001/01/04",1);
            });
        });

        describe('get test results',()=>{
            beforeEach(()=>{
                dao.getTestResults.mockReset();
                dao.getTestResults.mockReturnValue(
                    [
                        {
                            resultID: 1,
                            date: "2001/01/04",
                            result:1,
                            skuItemRfid:"123456789987654321",
                            testDescriptorID: 12
                        },
                        {
                            resultID: 3,
                            date: "1999/04/15",
                            result:1,
                            skuItemRfid:"987654321123456789",
                            testDescriptorID: 1
                        },
                        {
                            resultID: 6,
                            date: "2002/01/26",
                            result:0,
                            skuItemRfid:"987654321123456789",
                            testDescriptorID: 15
                        }
                    ]
                );
                dao.getTestResultsByRfid.mockReset();
                dao.getTestResultsByRfid.mockReturnValue(
                    [
                        {
                            resultID: 3,
                            date: "1999/04/15",
                            result:1,
                            skuItemRfid:"987654321123456789",
                            testDescriptorID: 1
                        },
                        {
                            resultID: 6,
                            date: "2002/01/26",
                            result:0,
                            skuItemRfid:"987654321123456789",
                            testDescriptorID: 15
                        }
                    ]
                )
            });

            test('get by rfid', async()=>{
                const tr =[
                    new TestResult(3,"1999/04/15",1,1),
                    new TestResult(6,"2002/01/26",0,15)
                ]
                const tests = await skuManager.getTestResultsByRfid("987654321123456789");
                expect(tests).toEqual(tr);
            });

            test('get all', async()=>{
                const tr =[
                    new TestResult(3,"1999/04/15",1,1),
                    new TestResult(6,"2002/01/26",0,15),
                    new TestResult(1,"2001/01/04",1,12),
                ]
                const tests = await skuManager.getTestResults();
                expect(tests).toEqual(tr);
            });

            test('get by ID', async()=>{
                const tr = new TestResult(3,"1999/04/15",1,1);
                const test = await skuManager.getSkuItemTestResultsByID(3,"987654321123456789");
                expect(test).toEqual(tr);
            });
        });

        describe('modify test result',()=>{
            test('modify by ID and rfid',async ()=>{
                await skuManager.modifyTestResult(1,"987654321123456789","aaa","1999/04/15",0);
                expect(dao.modifyTestResult.mock.calls[0][0]).toBe(1);
                expect(dao.modifyTestResult.mock.calls[0][1]).toBe("987654321123456789");
                expect(dao.modifyTestResult.mock.calls[0][2]).toBe("aaa");
                expect(dao.modifyTestResult.mock.calls[0][3]).toBe("1999/04/15");
                expect(dao.modifyTestResult.mock.calls[0][4]).toBe(0);
            })
        });

        describe('delete test result',()=>{
            test('delete by ID and rfid',async()=>{
                await skuManager.deleteTestResult(1,"987654321123456789");
                expect(dao.deleteTestResult.mock.calls[0][0]).toBe(1);
                expect(dao.deleteTestResult.mock.calls[0][1]).toBe("987654321123456789");
            })
        });

    });
});
