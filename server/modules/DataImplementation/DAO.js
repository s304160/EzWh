const { threadId } = require('worker_threads');

class DAO {
    sqlite = require('sqlite3');
    fs = require('fs');
    userQuery = require('./userQuery');
    positionQuery = require('./positionQuery');
    skuQuery = require('./skuQuery')
    testDescriptorQuery = require('./testDescriptorQuery');
    skuItemQuery = require('./skuItemQuery');
    testResultQuery = require('./testResultQuery');
    restockOrderQuery = require('./restockOrderQuery');
    returnOrderQuery = require('./returnOrderQuery');
    internalOrderQuery = require('./internalOrderQuery');
    itemQuery = require('./itemQuery');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });
    }

    destroyDB() {
        return new Promise((resolve, reject) => {
            const dataSql = this.fs.readFileSync('./modules/DataImplementation/TableDestructor.sql').toString();
            const queries = dataSql.split(';').map((q) => q + ";");

            this.db.serialize(() => {
                queries.forEach(async (q) => {
                    try {
                        await this.runQuery(q);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            resolve(true);
        });
    }

    runQuery(sql) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        })
    }

    startDB() {
        return new Promise((resolve, reject) => {
            const dataSql = this.fs.readFileSync('./modules/DataImplementation/TableCreator.sql').toString();
            const queries = dataSql.split(';').map((q) => q + ";");

            this.db.serialize(() => {
                queries.forEach(async (q) => {
                    try {
                        await this.runQuery(q);
                    } catch (err) {
                        reject(err);
                    }
                })
            })
            resolve(true)
        });
    }

    /* USER */
    async deleteUsers() {
        return await this.userQuery.deleteUsers(this.db)
    }
    async storeUser(data) {
        return await this.userQuery.storeUser(this.db, data);
    }

    async authenticateUser(data) {
        return await this.userQuery.authenticateUser(this.db, data);
    }

    async getUserByUsername(usr) {
        return await this.userQuery.getUserByUsername(this.db, usr);
    }

    async getSuppliers() {
        return await this.userQuery.getSuppliers(this.db);
    }

    async getUsers() {
        return await this.userQuery.getUsers(this.db);
    }

    async modifyRights(username, oldType, newType) {
        return await this.userQuery.modifyRights(this.db, username, oldType, newType);
    }

    async deleteUser(username, type) {
        return await this.userQuery.deleteUser(this.db, username, type);
    }


    /* POSITION */
    async deletePositions() {
        return await this.positionQuery.deletePositions(this.db);
    }
    async getMaxSpace(positionID) {
        return await this.positionQuery.getMaxSpace(this.db, positionID);
    }
    async getAvailableSpace(positionID) {
        return await this.positionQuery.getAvailableSpace(this.db, positionID);
    }
    async getSKUPosition(skuID) {
        return await this.positionQuery.getSKUPosition(this.db, skuID);
    }
    async storePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        return await this.positionQuery.storePosition(this.db, positionID, aisleID, row, col, maxWeight, maxVolume);
    }

    async getPositions() {
        return await this.positionQuery.getPositions(this.db);
    }

    async getPositionByID(positionID) {
        return await this.positionQuery.getPositionByID(this.db, positionID);
    }

    async updateOccupiedSpace(positionID, newVolume, newWeight) {
        return await this.positionQuery
            .updateOccupiedSpace(this.db, positionID, newVolume, newWeight);
    }

    async resetPosition(positionID) {
        return await this.positionQuery.resetPosition(this.db, positionID);
    }

    async modifyPositionByID(oldID, newAisleId, newRow, newCol, newMaxWeight, newMaxVolume,
        newOccupiedWeight, newOccupiedVolume) {

        return await this.positionQuery
            .modifyPositionByID(this.db,
                oldID,
                newAisleId,
                newRow,
                newCol,
                newMaxWeight,
                newMaxVolume,
                newOccupiedWeight,
                newOccupiedVolume);
    }

    async modifyPositionID(oldPositionID, newPositionID) {
        return await this.positionQuery.modifyPositionID(this.db, oldPositionID, newPositionID);
    }


    async deletePositionByID(positionID) {
        return await this.positionQuery.deletePositionByID(this.db, positionID);
    }


    /* - SKU - */
    async getSKUPosition(skuID) {
        return await this.skuQuery.getSKUPosition(this.db, skuID);
    }
    async getSKUMaxID() {
        return await this.skuQuery.getMaxID(this.db);
    }
    async storeSKU(sku, availableQuantity) {
        return await this.skuQuery.storeSKU(this.db, sku, availableQuantity);
    }

    async getSKUs() {
        return await this.skuQuery.getSKUs(this.db);
    }

    async modifySKUByID(skuID, newDescription, newWeight, newVolume, newNotes,
        newPrice,
        newAvailableQuantity) {
        return await this.skuQuery
            .modifySKUByID(this.db, skuID, newDescription,
                newWeight,
                newVolume,
                newNotes,
                newPrice,
                newAvailableQuantity);
    }

    async updateSKUPosition(skuID, positionID, newVolume, newWeight) {
        return await this.skuQuery.updateSKUPosition(this.db, skuID, positionID, newVolume, newWeight)
    }

    async deleteSKU(skuID) {
        return await this.skuQuery.deleteSKU(this.db, skuID);
    }

    async deleteAllSkus() {
        return await this.skuQuery.deleteAllSkus(this.db);
    }

    /* TEST DESCRIPTOR */
    async getSKUTestDescriptors(skuID) {
        return await this.testDescriptorQuery.getSKUTestDescriptors(this.db, skuID);
    }

    async getTestDescriptors() {
        return await this.testDescriptorQuery.getTestDescriptors(this.db);
    }

    async storeTestDescriptor(name, procedureDescription, skuID, newID) {
        return await this.testDescriptorQuery.storeTestDescriptor(this.db, name, procedureDescription, skuID, newID);
    }

    async getTDMaxID() {
        return await this.testDescriptorQuery.getTDMaxID(this.db);
    }

    async modifyTestDescriptorByID(testDescriptorID, newName, newProcedureDescription, newSkuID) {
        return await this.testDescriptorQuery.modifyTestDescriptorByID(this.db, testDescriptorID, newName, newProcedureDescription, newSkuID)
    }

    async deleteTestDescriptor(testDescriptorID) {
        return await this.testDescriptorQuery.deleteTestDescriptor(this.db, testDescriptorID);
    }

    async deleteTestDescriptors() {
        return await this.testDescriptorQuery.deleteTestDescriptors(this.db);
    }

    /* SKU ITEM */
    async storeSkuItem(rfid, available, skuID, dateOfStock) {
        return await this.skuItemQuery.storeSKUItem(this.db, rfid, available, skuID, dateOfStock);
    }

    async getSkuItems() {
        return await this.skuItemQuery.getSkuItems(this.db);
    }

    async getSkuItemsAvailable() {
        return await this.skuItemQuery.getSkuItemsAvailable(this.db);
    }

    async modifySkuItem(oldRFID, newRFID, newAvailable, newDateOfStock) {
        return this.skuItemQuery.modifySkuItem(this.db, oldRFID, newRFID, newAvailable, newDateOfStock);
    }

    async deleteSkuItem(rfid) {
        return await this.skuItemQuery.deleteSkuItem(this.db, rfid);
    }

    async deleteSkuItems() {
        return await this.skuItemQuery.deleteSkuItems(this.db);
    }

    /* TEST RESULT */
    async storeTestResult(resultID, rfid, testDescriptorID, date, result) {
        return await this.testResultQuery.storeTestResult(this.db, resultID, rfid, testDescriptorID, date, result);
    }

    async getTestResultsByRfid(rfid) {
        return await this.testResultQuery.getTestResultsByRfid(this.db, rfid);
    }

    async getTestResults() {
        return await this.testResultQuery.getTestResults(this.db);
    }

    async getMaxResultID() {
        return await this.testResultQuery.getMaxResultID(this.db);
    }

    async modifyTestResult(resultID, rfid, newTestDescriptorID, newDate, newResult) {
        return await this.testResultQuery.modifyTestResult(this.db, resultID, rfid, newTestDescriptorID, newDate, newResult);
    }
    async deleteTestResult(resultID, rfid) {
        return await this.testResultQuery.deleteTestResult(this.db, resultID, rfid);
    }

    async deleteTestResults() {
        return await this.testResultQuery.deleteTestResults(this.db);
    }


    /* RESTOCK ORDER */

    async getRestockOrders() { return await this.restockOrderQuery.getRestockOrders(this.db); }

    async getReturnItemsOfRestockOrder(restockOrderID) { return await this.restockOrderQuery.getReturnItemsOfRestockOrder(this.db, restockOrderID); }

    async getTransportNote(restockOrderID) { return await this.restockOrderQuery.getTransportNote(this.db, restockOrderID); }

    async getItemsByRestockOrder(restockOrderID) { return await this.restockOrderQuery.getItemsByRestockOrder(this.db, restockOrderID); }

    async getItemsBySupplierID(supplierID) { return await this.itemQuery.getItemsBySupplierID(this.db, supplierID); }

    async getSKUItemsByRestockOrder(restockOrderID) { return await this.restockOrderQuery.getSKUItemsByRestockOrder(this.db, restockOrderID); }

    async getMaxRestockOrderID() {
        return await this.restockOrderQuery.getMaxRestockOrderID(this.db);
    }
    async storeRestockOrder(issueDate, items, supplierId, newID) {
        return await this.restockOrderQuery.storeRestockOrder(
            this.db, issueDate, items, supplierId, newID);
    }

    async modifyRestockOrderState(restockOrderID, newState) { return await this.restockOrderQuery.modifyRestockOrderState(this.db, restockOrderID, newState); }

    async modifyRestockOrderSKUItems(restockOrderID, SKUItems) { return await this.restockOrderQuery.modifyRestockOrderSKUItems(this.db, restockOrderID, SKUItems); }

    async addRestockOrderTransportNote(restockOrderID, transportNote) { return await this.restockOrderQuery.addRestockOrderTransportNote(this.db, restockOrderID, transportNote); }

    async deleteRestockOrder(restockOrderID) { return await this.restockOrderQuery.deleteRestockOrder(this.db, restockOrderID); }

    async deleteRestockOrders() { return await this.restockOrderQuery.deleteRestockOrders(this.db); }


    /* RETURN ORDER */

    async getReturnOrders() { return await this.returnOrderQuery.getReturnOrders(this.db); }

    async getProductsByReturnOrder(returnOrderID) { return await this.returnOrderQuery.getProductsByReturnOrder(this.db, returnOrderID); }

    async getMaxReturnOrderID() { return await this.returnOrderQuery.getMaxReturnOrderID(this.db); }

    async storeReturnOrder(returnDate, skuItems, restockOrderID, newID) {
        return await this.returnOrderQuery.storeReturnOrder(
            this.db, returnDate, skuItems, restockOrderID, newID);
    }

    async deleteReturnOrder(returnOrderID) { return await this.returnOrderQuery.deleteReturnOrder(this.db, returnOrderID); }

    async deleteReturnOrders() { return await this.returnOrderQuery.deleteReturnOrders(this.db); }



    /* INTERNAL ORDER */

    async getInternalOrders() { return await this.internalOrderQuery.getInternalOrders(this.db); }

    async getProductsOfInternalOrder(internalOrderID, state) { return await this.internalOrderQuery.getProductsOfInternalOrder(this.db, internalOrderID, state); }

    async getMaxInternalOrderID() { return await this.internalOrderQuery.getMaxInternalOrderID(this.db); }

    async storeInternalOrder(issueDate, customerID, skus, newID) {
        return await this.internalOrderQuery.storeInternalOrder(
            this.db, issueDate, customerID, skus, newID);
    }

    async modifyInternalOrder(internalOrderID, newState, skuItemList) { return await this.internalOrderQuery.modifyInternalOrder(this.db, internalOrderID, newState, skuItemList); }

    async deleteInternalOrder(internalOrderID) { return await this.internalOrderQuery.deleteInternalOrder(this.db, internalOrderID); }

    async deleteInternalOrders() { return await this.internalOrderQuery.deleteInternalOrders(this.db); }
    /* ITEMS */
    async checkSupplierSells(supplierID, skuID, itemID) {
        return await this.itemQuery.checkSupplierSells(this.db, supplierID, skuID, itemID);
    }
    async getItems() { return await this.itemQuery.getItems(this.db); }

    async storeItem(itemID, description, price, skuID, supplierID) {
        return await this.itemQuery.storeItem(this.db, itemID, description, price, skuID, supplierID);
    }

    async modifyItem(itemID, newDescription, newPrice) {
        return await this.itemQuery.modifyItem(this.db, itemID, newDescription, newPrice);
    }

    async deleteItem(itemID) { return await this.itemQuery.deleteItem(this.db, itemID); }
    async deleteItemBySupplierID(itemID, supplierID) { return await this.itemQuery.deleteItemBySupplierID(this.db, itemID, suppl); }

    async deleteItems() { return await this.itemQuery.deleteItems(this.db); }

}

module.exports = DAO;