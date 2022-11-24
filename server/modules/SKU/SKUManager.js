const DAO = require("../DataImplementation/DAO");
const Inventory = require("../Inventory/Inventory");
const SKUItem = require("../SKUItem/SKUItem");
const TestDescriptor = require("../TestDescriptor/TestDescriptor");
const TestResult = require("../TestResult/TestResult");

class SKUManager {
    // database = new DAO("ezwhDb.sqlite");
    constructor(database) {
        this.inventory = new Inventory(database);
        this.positionList = [];
        this.database = database;
    }

    async getSKUs() {
        var skus = await this.inventory.getSKUList(); //list of sku object
        var positions = await this.database.getPositions(); //json
        var testDescriptors = await this.database.getTestDescriptors(); //json

        skus.forEach((s) => {
            var pos = positions.find((p) => p.skuID == s.getID());
            var td = testDescriptors.filter((t) => t.skuID == s.getID());
            s.setPosition(pos ? pos.positionID : '');
            s.addTestDescriptors(td);
        });

        return skus;
    }

    async getSKUByID(id) {
        var skus = await this.inventory.getSKUList(); // list of sku object
        var sku = skus.find((s) => s.getID() == id);
        if (sku === undefined) {
            return sku
        }

        const positionID = await this.database.getSKUPosition(sku.getID());
        const td = await this.database.getSKUTestDescriptors(sku.getID());
        sku.setPosition(positionID);
        sku.addTestDescriptors(td);
        return sku;
    }

    async createSKU(description, weight, volume, notes, price, availableQuantity) {
        await this.inventory.addSKU(description, weight, volume, notes, price, availableQuantity);
    }

    async modifySKUByID(skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
        await this.database.modifySKUByID(skuID,
            newDescription,
            newWeight,
            newVolume,
            newNotes, newPrice,
            newAvailableQuantity);
    }

    async updateSKUPosition(sku, positionID) {
        await this.database.updateSKUPosition(sku.getID(), positionID, sku.getTotalVolume(), sku.getTotalWeight());
        if (sku.getPosition() != "") {
            // reset the old position
            await this.database.resetPosition(sku.getPosition());
        }
    }

    async deleteSKU(skuID) {
        const sku = await this.getSKUByID(skuID);
        await this.inventory.deleteSKU(skuID);
        sku ? this.database.resetPosition(sku.getPosition()) : ''
    }

    async storeSkuItem(rfid, available, skuID, dateOfStock) {
        await this.database.storeSkuItem(rfid, available, skuID, dateOfStock);
    }

    async getSkuItems() {
        var skuItems = [];
        const res = await this.database.getSkuItems();
        res.forEach((r) => {
            skuItems.push(new SKUItem(r.rfid, r.available, r.skuID, r.dateOfStock));
        })
        return skuItems;
    }

    async getSkuItemsAvailable() {
        var skuItems = [];
        const res = await this.database.getSkuItemsAvailable();
        res.forEach((r) => {
            skuItems.push(new SKUItem(r.rfid, r.available, r.skuID, r.dateOfStock));
        })
        return skuItems;
    }

    async getSkuItemByRfid(rfid) {
        const res = await this.getSkuItems();
        const skuItem = res.find((s) => s.getRFID() == rfid);
        return skuItem;
    }

    async modifySkuItem(skuItem, newRFID, newAvailable, newDateOfStock) {
        await this.database.modifySkuItem(skuItem.getRFID(), newRFID, newAvailable, newDateOfStock);
    }

    async deleteSkuItem(rfid) {
        await this.database.deleteSkuItem(rfid);
    }

    async storeTestDescriptor(name, procedureDescription, skuID) {
        const newID = await this.database.getTDMaxID() + 1;
        await this.database.storeTestDescriptor(name, procedureDescription, skuID, newID);
    }

    async getTestDescriptors() {
        var tds = await this.database.getTestDescriptors();
        tds = tds.map((t) => {
            return new TestDescriptor(t.testDescriptorID, t.name, t.procedureDescription, t.skuID);
        })
        return tds;
    }

    async getTestDescriptorByID(testDescriptorID) {
        const tds = await this.getTestDescriptors();
        return tds.find((t) => t.getID() == testDescriptorID);
    }

    async modifyTestDescriptorByID(testDescriptorID, newName, newProcedureDescription, newSkuID) {
        await this.database.modifyTestDescriptorByID(testDescriptorID, newName, newProcedureDescription, newSkuID)
    }

    async deleteTestDescriptor(testDescriptorID) {
        await this.database.deleteTestDescriptor(testDescriptorID);
    }

    async storeTestResult(rfid, testDescriptorID, date, result) {
        const newID = await this.database.getMaxResultID() + 1;
        await this.database.storeTestResult(newID, rfid, testDescriptorID, date, result);
    }

    async getTestResultsByRfid(rfid) {
        var res = await this.database.getTestResultsByRfid(rfid);
        res = res.map((r) => {
            return new TestResult(r.resultID, r.date, r.result, r.testDescriptorID);
        })
        return res;
    }

    async getTestResults() {
        var res = await this.database.getTestResults();
        res = res.map((r) => {
            return new TestResult(r.resultID, r.date, r.result, r.testDescriptorID);
        })
        return res;
    }

    async getTestResultByID(resultID) {
        var testResults = await this.getTestResults();
        return testResults.find((t) => t.getID() == resultID);
    }

    async getSkuItemTestResultsByID(resultID, rfid) {
        const skuResults = await this.getTestResultsByRfid(rfid);
        return skuResults.find((r) => r.getID() == resultID);
    }

    async modifyTestResult(resultID, rfid, newTestDescriptorID, newDate, newResult) {
        await this.database.modifyTestResult(resultID, rfid, newTestDescriptorID, newDate, newResult);
    }

    async deleteTestResult(resultID, rfid) {
        await this.database.deleteTestResult(resultID, rfid);
    }
}
module.exports = SKUManager