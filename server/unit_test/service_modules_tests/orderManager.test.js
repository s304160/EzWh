const InternalOrder = require("../../modules/InternalOrder/InternalOrder");
const Item = require("../../modules/Item/Item");
const OrderManager = require("../../modules/Item/OrderManager");
const RestockOrder = require("../../modules/RestockOrder/RestockOrder");
const TransportNote = require("../../modules/RestockOrder/TransportNote");
const ReturnOrder = require("../../modules/ReturnOrder/ReturnOrder");
const SKUManager = require("../../modules/SKU/SKUManager");
const SKUItem = require("../../modules/SKUItem/SKUItem");
const dao = require("./mock_dao/mock_orderManager_dao");
const skuManager = new SKUManager(dao);
const orderManager= new OrderManager(dao,skuManager);

describe("order manager test",()=>{

    describe("Item tests",()=>{
        describe("get items",()=>{
            beforeEach(()=>{
                dao.getItems.mockReset();
                dao.getItems.mockReturnValue(
                    [
                        {
                            itemID: 1,
                            supplierID: 1,
                            description: "aaa",
                            price: 15.99,
                            skuID: 1
                        },
                        {
                            itemID: 2,
                            supplierID: 1,
                            description: "bbb",
                            price: 15.99,
                            skuID: 1
                        }
                    ]
                );
            });

            test("get all items", async()=>{
                const expected = [new Item(1,"aaa",15.99,1,1)]
                const items = await orderManager.getItems();
                expect(items[0].toJSON()).toEqual(expected[0].toJSON());
            });

            test("get item by id", async ()=>{
                const expected = new Item(2,"bbb",15.99,1,1)
                const item = await orderManager.getItemByID(2);
                expect(item.toJSON()).toEqual(expected.toJSON());
            });
        });

        describe("store items",()=>{
            test("store", async()=>{
                await orderManager.storeItem(1,"aaa",15.99,1,1);
                expect(dao.storeItem.mock.calls[0][0]).toBe(1);
                expect(dao.storeItem.mock.calls[0][1]).toBe("aaa");
                expect(dao.storeItem.mock.calls[0][2]).toBe(15.99);
                expect(dao.storeItem.mock.calls[0][3]).toBe(1);
                expect(dao.storeItem.mock.calls[0][4]).toBe(1);
            });
        });

        describe('modify item',()=>{
            test('modify', async()=>{
                await orderManager.modifyItem(1,"bbb",9.99);
                expect(dao.modifyItem.mock.calls[0][0]).toBe(1);
                expect(dao.modifyItem.mock.calls[0][1]).toBe("bbb");
                expect(dao.modifyItem.mock.calls[0][2]).toBe(9.99);
            });
        });

        describe('delete item',()=>{
            test('delete',async()=>{
                await orderManager.deleteItem(1);
                expect(dao.deleteItem.mock.calls[0][0]).toBe(1);
            });
        });
    })

    describe("Restock order tests",()=>{
        describe("get restock orders",()=>{
            beforeEach(()=>{
                dao.getTransportNote.mockReset();
                dao.getTransportNote.mockReturnValue("1999/04/15");
                dao.getItemsByRestockOrder.mockReset();
                dao.getItemsByRestockOrder.mockReturnValue(
                    [
                        {
                            itemID: 1,
                            supplierID: 1,
                            description: "aaa",
                            price: 15.99,
                            skuID: 1,
                            restockOrderID: 1,
                            qty: 50
                        }
                    ]
                );
                dao.getRestockOrders.mockReset();
                dao.getRestockOrders.mockReturnValue(
                    [
                        {
                            orderID: 1,
                            issueDate: "1999/04/15",
                            state: "DELIVERY",
                            supplierID: 1
                        },
                        {
                            orderID: 2,
                            issueDate: "2002/01/26",
                            state: "ISSUED",
                            supplierID: 2
                        }
                    ]
                );

                dao.getSKUItemsByRestockOrder.mockReset();
                dao.getSKUItemsByRestockOrder.mockReturnValue(
                    [
                        {
                            skuID: 1,
                            rfid:"123456789987654321"
                        }
                    ]
                );
            });

            test("get all restock orders",async()=>{
                const tn1 = new TransportNote("1999/04/15");
                const ro1 = new RestockOrder(1,"1999/04/15","DELIVERY",1);
                ro1.setTransportNote(tn1);
                const item1 = new Item(1,"aaa",15.99,1);
                item1.setQuantity(50);
                ro1.addItem(item1);
                ro1.addSKUItem({skuID:1,rfid:"123456789987654321"});
                const restockOrders = [ro1];
               
                const list = await orderManager.getRestockOrders();
                expect(list[0].toJSON()).toEqual(restockOrders[0].toJSON())
            });

            test("get issued restock orders", async()=>{
                const tn1 = new TransportNote("1999/04/15");
                const ro1 = new RestockOrder(2,"2002/01/26","ISSUED",2);
                ro1.setTransportNote(tn1);
                const item1 = new Item(1,"aaa",15.99,1);
                ro1.addItem(item1);
                item1.setQuantity(50);
                ro1.addSKUItem({skuID:1,rfid:"123456789987654321"});
                const restockOrders = [ro1];
                
                const list = await orderManager.getRestockOrdersIssued();
                expect(list[0].toJSON()).toEqual(restockOrders[0].toJSON())
            });

            test("get restock order by ID", async()=>{
                const tn1 = new TransportNote("1999/04/15");
                const ro1 = new RestockOrder(2,"2002/01/26","ISSUED",2);
                ro1.setTransportNote(tn1);
                const item1 = new Item(1,"aaa",15.99,1);
                ro1.addItem(item1);
                item1.setQuantity(50);
                ro1.addSKUItem({skuID:1,rfid:"123456789987654321"});

                const order = await orderManager.getRestockOrderByID(2);
                expect(order.toJSON()).toEqual(ro1.toJSON())
            });

            test('get return items od restock order', async()=>{
                await orderManager.getReturnItemsOfRestockOrder(1);
                expect(dao.getReturnItemsOfRestockOrder.mock.calls[0][0]).toBe(1)
            });
        });

        describe("store restock order",()=>{
            beforeEach(()=>{
                dao.getMaxRestockOrderID.mockReset();
                dao.getMaxRestockOrderID.mockReturnValue(0);

                dao.getItems.mockReset();
                dao.getItems.mockReturnValue(
                    [
                        {
                            itemID: 1,
                            supplierID: 1,
                            description: "aaa",
                            price: 15.99,
                            skuID: 4
                        }
                    ]
                );
            });

            test("store order", async ()=>{
                const item = new Item(1,"aaa",15.99,4,1);
                
                await orderManager.storeRestockOrder("2001/01/04",
                    [{
                        "SKUId": 4,
                        "description": "a product",
                        "price": 10.99,
                        "qty": 30
                    }], 1);
                expect(dao.storeRestockOrder.mock.calls[0][0]).toBe("2001/01/04");
                expect(dao.storeRestockOrder.mock.calls[0][1][0].toJSON()).toEqual(item.toJSON());
                expect(dao.storeRestockOrder.mock.calls[0][2]).toBe(1);
                expect(dao.storeRestockOrder.mock.calls[0][3]).toBe(1);
            });
        });

        describe("modify restock order",()=>{
            test("modify state",async ()=>{
                await orderManager.modifyRestockOrderState(1,"DELIVERED");
                expect(dao.modifyRestockOrderState.mock.calls[0][0]).toBe(1);
                expect(dao.modifyRestockOrderState.mock.calls[0][1]).toBe("DELIVERED");
            });

            test("modify restock order of sku items",async()=>{
                await orderManager.modifyRestockOrderSKUItems(1,"aaa");
                expect(dao.modifyRestockOrderSKUItems.mock.calls[0][0]).toBe(1);
                expect(dao.modifyRestockOrderSKUItems.mock.calls[0][1]).toBe("aaa");
            });

            test("add transport note",async()=>{
                await orderManager.addRestockOrderTransportNote(1,"aaa");
                expect(dao.addRestockOrderTransportNote.mock.calls[0][0]).toBe(1);
                expect(dao.addRestockOrderTransportNote.mock.calls[0][1]).toBe("aaa");
            });
        });

        describe("delete restock order",()=>{
            test("delete",async()=>{
                await orderManager.deleteRestockOrder(1);
                expect(dao.deleteRestockOrder.mock.calls[0][0]).toBe(1);
            });
        });
    });

    describe("Return order tests",()=>{
        describe("get return orders",()=>{
            beforeEach(()=>{
                dao.getReturnOrders.mockReset();
                dao.getReturnOrders.mockReturnValue(
                    [
                        {
                            orderID: 1,
                            restockOrderID: 1,
                            returnDate: "2001/01/04"
                        },
                        {
                            orderID: 2,
                            restockOrderID: 1,
                            returnDate: "1999/04/15"
                        }
                    ]
                );

                dao.getProductsByReturnOrder.mockReset();
                dao.getProductsByReturnOrder
                    .mockReturnValue(
                    [
                        {
                            skuID: 1,
                            rfid: "987654321123456789",
                            description: "aaa",
                            price: 15.99
                        }
                    ]
                );
            })

            test("get all", async()=>{
                const ro = new ReturnOrder(1,"2001/01/04",1);
                ro.addSkuItem(
                    {
                        skuID: 1,
                        rfid: "987654321123456789",
                        description: "aaa",
                        price: 15.99
                    });
                
                const orders = await orderManager.getReturnOrders();
                expect(orders[0].getID()).toBe(ro.getID());
                expect(orders[0].getSkuItemList().skuId).toEqual(ro.getSkuItemList().SKUId);
            });

            test("get by id",async()=>{
                const ro = new ReturnOrder(2,"1999/04/15",1);
                ro.addSkuItem(
                    {
                        skuID: 1,
                        rfid: "987654321123456789",
                        description: "aaa",
                        price: 15.99
                    });
                const order = await orderManager.getReturnOrderByID(2);
                expect(order.toJSON()).toEqual(ro.toJSON())
            });
        });
        
        describe("store return order",()=>{
            beforeEach(()=>{
                dao.getMaxReturnOrderID.mockReset();
                dao.getMaxReturnOrderID.mockReturnValue(0);

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
            });

            test("store", async()=>{
                await orderManager.storeReturnOrder("2001/01/04",
                    [{
                        "SKUId": 1,
                        "description": "a product",
                        "price": 10.99,
                        "RFID": "987654321123456789"
                    }],1);
                const skuItem= new SKUItem("987654321123456789",1,1,"2001/01/04");
                expect(dao.storeReturnOrder.mock.calls[0][0]).toBe("2001/01/04");
                expect(dao.storeReturnOrder.mock.calls[0][1][0].getRFID()).toBe(skuItem.getRFID());
                expect(dao.storeReturnOrder.mock.calls[0][2]).toBe(1);
                expect(dao.storeReturnOrder.mock.calls[0][3]).toBe(1);
            });
        });

        describe("delete return order",()=>{
            test("delete by ID",async()=>{
                await orderManager.deleteReturnOrder(1);
                expect(dao.deleteReturnOrder.mock.calls[0][0]).toBe(1)
            });
        });
    });

    describe("Internal order tests",()=>{
        describe("get internal order tests",()=>{
            beforeEach(()=>{
                dao.getInternalOrders.mockReset();
                dao.getInternalOrders.mockReturnValue(
                    [
                        {
                            orderID: 1,
                            issueDate: "1999/04/15",
                            state: "COMPLETED",
                            customerID: 1
                        },
                        {
                            orderID: 2,
                            issueDate: "2002/01/26",
                            state: "ISSUED",
                            customerID: 1
                        },
                        {
                            orderID: 3,
                            issueDate: "2002/01/26",
                            state: "ACCEPTED",
                            customerID: 1
                        }
                    ]
                );

                dao.getProductsOfInternalOrder.mockReset();
                dao.getProductsOfInternalOrder.mockReturnValueOnce(
                    [
                        {
                            skuID: 1,
                            description: "aaa",
                            price: 15.99,
                            rfid: "123456789987654321"
                        }
                    ]
                )
                .mockReturnValue(
                    [
                        {
                            skuID: 1,
                            description: "aaa",
                            price: 15.99,
                            qty: 50
                        }
                    ]
                );
            });

            test("get all internal orders", async()=>{
                const io = new InternalOrder(1,"1999/04/15","COMPLETED",1);
                
                io.addSku({
                    skuID: 1,
                    description: "aaa",
                    price: 15.99,
                    rfid: "123456789987654321"
                });

                const orders = await orderManager.getInternalOrders();
                expect(orders[0].toJSON()).toEqual(io.toJSON())
            });

            test('get internal order issued',async()=>{
                const io = new InternalOrder(2,"2002/01/26","ISSUED",1);
                io.addSku({
                    skuID: 1,
                    description: "aaa",
                    price: 15.99,
                    qty: 50
                });

                const orders = await orderManager.getInternalOrdersIssued();
                expect(orders[0].toJSON()).toEqual(io.toJSON())
            });

            test('get internal order accepted',async()=>{
                const io = new InternalOrder(3,"2002/01/26","ACCEPTED",1);
                io.addSku({
                    skuID: 1,
                    description: "aaa",
                    price: 15.99,
                    qty: 50
                });

                const orders = await orderManager.getInternalOrdersAccepted();
                expect(orders[0].toJSON()).toEqual(io.toJSON())
            });

            test('get by id', async()=>{
                const io = new InternalOrder(3,"2002/01/26","ACCEPTED",1);
                io.addSku({
                    skuID: 1,
                    description: "aaa",
                    price: 15.99,
                    qty: 50
                });

                const order = await orderManager.getInternalOrderByID(3);
                expect(order.toJSON()).toEqual(io.toJSON())
            });
        });
        
        describe("modify internal orders",()=>{
            test("modify",async()=>{
                await orderManager.modifyInternalOrder(1,"aaa",[]);
                expect(dao.modifyInternalOrder.mock.calls[0][0]).toBe(1)
                expect(dao.modifyInternalOrder.mock.calls[0][1]).toBe("aaa")
                expect(dao.modifyInternalOrder.mock.calls[0][2]).toEqual([])
            })
        });

        describe("delete internal orders",()=>{
            test("delete",async()=>{
                await orderManager.deleteInternalOrder(1);
                expect(dao.deleteInternalOrder.mock.calls[0][0]).toBe(1)
            })
        })
    });
});