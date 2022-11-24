const SKUManager = require("../SKU/SKUManager");
const RestockOrder = require("../RestockOrder/RestockOrder");
const ReturnOrder = require("../ReturnOrder/ReturnOrder");
const InternalOrder = require("../InternalOrder/InternalOrder");
const TransportNote = require("../RestockOrder/TransportNote");
const Item = require("./Item");
const { json } = require("express");
const DAO = require("../DataImplementation/DAO");
const { getSkuItems } = require("../DataImplementation/skuItemQuery");
const SKUItem = require("../SKUItem/SKUItem");
const SKU = require("../SKU/SKU");

class OrderManager {
    // database = new DAO("ezwhDb.sqlite");
    constructor(database, skuManager) {
        this.restockOrders = [];
        this.returnOrders = [];
        this.internalOrders = [];
        this.items = [];
        this.database = database;
        this.skuManager = skuManager;
    }

    /* - RESTOCK ORDER - */

    async getRestockOrders() {
        let restockOrders = await this.database.getRestockOrders();
        this.restockOrders = []

        for (let r of restockOrders) {
            let tn = await this.database.getTransportNote(r.orderID);
            const transportNote = tn ? new TransportNote(tn.deliveryDate) : {}
            let products = await this.database.getItemsByRestockOrder(r.orderID);
            let skuItems = await this.database.getSKUItemsByRestockOrder(r.orderID);

            // products.forEach((p) => {
            //     skuItems.filter((s) => s.skuID === p.skuID).forEach((s) => s["itemId"] = p.itemID);
            // })

            const ro = new RestockOrder(r.orderID, r.issueDate, r.state, r.supplierID);
            ro.setTransportNote(transportNote);
            products.forEach((prod) => {
                const item = new Item(prod.itemID, prod.description, prod.price, prod.skuID);
                item.setQuantity(prod.qty);
                ro.addItem(item)
            });
            skuItems.forEach((s) => ro.addSKUItem(s));
            this.restockOrders.push(ro)
        }
        return this.restockOrders;
    }

    async getRestockOrdersIssued() {
        await this.getRestockOrders();
        return this.restockOrders.filter((order) => order.getState() === "ISSUED");
    }

    async getRestockOrderByID(restockOrderID) {
        await this.getRestockOrders();

        return this.restockOrders.find((order) => {
            if (order.getID() == restockOrderID)
                return order;
        })
    }
    async getReturnItemsOfRestockOrder(id) {
        return await this.database.getReturnItemsOfRestockOrder(id);
    }

    async storeRestockOrder(issueDate, products, supplierId) {
        const newID = await this.database.getMaxRestockOrderID() + 1;
        var items = await this.getItems();

        items = items.filter((i) => i.getSupplier() == supplierId);
        items.forEach((i) => {
            products.forEach((p) => {
                if (p.SKUId == i.getSku() && p.itemId == i.getID()) {
                    i.setQuantity(p.qty);
                }
            })
        });

        await this.database.storeRestockOrder(issueDate, items, supplierId, newID);
    }

    async modifyRestockOrderState(id, newState) {
        await this.database.modifyRestockOrderState(id, newState);
    }

    async modifyRestockOrderSKUItems(id, SKUItems) {
        await this.database.modifyRestockOrderSKUItems(id, SKUItems);
    }

    async addRestockOrderTransportNote(id, transportNote) {
        await this.database.addRestockOrderTransportNote(id, transportNote);
    }

    async deleteRestockOrder(id) {
        await this.database.deleteRestockOrder(id);
    }


    /* - RETURN ORDER - */

    async getReturnOrders() {
        this.returnOrders = [];
        let res = await this.database.getReturnOrders();

        for (let r of res) {
            let returnOrder = new ReturnOrder(r.orderID, r.returnDate, r.restockOrderID);

            let products = await this.database.getProductsByReturnOrder(r.orderID);

            if (products !== undefined) {
                products.forEach(p => {
                    returnOrder.addSkuItem(p);
                });
            };

            this.returnOrders.push(returnOrder)
        };

        return this.returnOrders;
    }

    async getReturnOrderByID(returnOrderID) {
        await this.getReturnOrders();
        return this.returnOrders.find((order) => order.getID() == returnOrderID);
    }

    async storeReturnOrder(returnDate, products, restockOrderID) {
        const newID = await this.database.getMaxReturnOrderID() + 1;
        let skuItems = await this.skuManager.getSkuItems();
        //let skus = await this.skuManager.getSKUs();     

        skuItems = skuItems.filter((s) => {
            let result;
            for (let p of products) {
                if (s.getRFID() == p.RFID) {
                    result = true;
                    break;
                }
            }
            return result;
        })

        await this.database.storeReturnOrder(returnDate, skuItems, restockOrderID, newID);
    }

    async deleteReturnOrder(id) {
        await this.database.deleteReturnOrder(id);
    }


    /* - INTERNAL ORDER - */

    async getInternalOrders() {
        this.internalOrders = [];
        let res = await this.database.getInternalOrders();

        for (let order of res) {
            let internalOrder = new InternalOrder(order.orderID, order.issueDate,
                order.state, order.customerID);

            let products = await this.database.getProductsOfInternalOrder(internalOrder.getID(), internalOrder.getState());  //sku items      

            if (products !== undefined) {
                products.forEach(p => {
                    internalOrder.addSku(p);
                });
            }
            this.internalOrders.push(internalOrder)
        };

        return this.internalOrders;
    }

    async getInternalOrdersIssued() {
        await this.getInternalOrders();
        return this.internalOrders.filter((order) => order.getState() === "ISSUED")
    }

    async getInternalOrdersAccepted() {
        await this.getInternalOrders();
        return this.internalOrders.filter((order) => order.getState() === "ACCEPTED");
    }

    async getInternalOrderByID(internalOrderID) {
        await this.getInternalOrders();
        return this.internalOrders.find((order) => order.getID() == internalOrderID)
    }

    async storeInternalOrder(issueDate, customerID, products) {
        const newID = await this.database.getMaxInternalOrderID() + 1;
        let skus = await this.skuManager.getSKUs();

        skus = skus.filter((s) => {
            let result = false;
            for (let p of products) {
                if (p.SKUId === s.getID()) {
                    s.setQuantity(p.qty);
                    result = true;
                    break;
                }
            }
            return result;
        })

        await this.database.storeInternalOrder(issueDate, customerID, skus, newID);
    }

    async modifyInternalOrder(internalOrderID, newState, skuItemList) {
        await this.database.modifyInternalOrder(internalOrderID, newState, skuItemList);
    }

    async deleteInternalOrder(internalOrderID) {
        await this.database.deleteInternalOrder(internalOrderID);
    }



    /* - ITEM - */
    async checkSupplierSells(supplierID, skuID, itemID) {
        const res = await this.database.checkSupplierSells(supplierID, skuID, itemID);
        return res ? true : false;
    }

    async getItems() {
        this.items = [];
        let res = await this.database.getItems();

        for (let i of res) {
            let item = new Item(i.itemID, i.description,
                i.price, i.skuID, i.supplierID);

            this.items.push(item)
        };

        return this.items;
    }

    async getItemByID(itemID) {
        await this.getItems();

        return this.items.find((item) => item.getID() == itemID);
    }

    async getItemByIDAndSupplierID(itemID, supplierID) {
        await this.getItems();
        console.log(this.items[0].toJSON())
        return this.items.find((item) => item.getID() == itemID && item.getSupplier() == supplierID);
    }

    async storeItem(itemID, description, price, skuID, supplierID) {
        await this.database.storeItem(itemID, description, price, skuID, supplierID);
    }

    async modifyItem(itemID, newDescription, newPrice) {
        await this.database.modifyItem(itemID, newDescription, newPrice);
    }

    async deleteItem(itemID) {
        await this.database.deleteItem(itemID);
    }

    async deleteItemBySupplierID(itemID, supplierID) {
        await this.database.deleteItemBySupplierID(itemID, supplierID);
    }

}
module.exports = OrderManager