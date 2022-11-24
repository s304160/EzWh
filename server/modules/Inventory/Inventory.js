const { json } = require("express");
const DAO = require("../DataImplementation/DAO");
const SKU = require("../SKU/SKU");

class Inventory {
    // database = new DAO("ezwhDb.sqlite");
    constructor(database) {
        //this.SKUMap = new Map(); // Map <SKU, availableQuantity>
        this.skuList = [];
        this.database = database;
    }

    async getMaxID() {
        return await this.database.getSKUMaxID();
    }

    async getSKUList() {
        const skus = await this.database.getSKUs();
        this.skuList = [];
        skus.forEach((s) => {
            const sku = new SKU(s.skuID, s.description, s.weight, s.volume, s.price, s.notes);
            sku.setAvailableQuantity(s.availableQuantity);
            this.skuList.push(sku);
        });
        return this.skuList;
    }

    async addSKU(description, weight, volume, notes, price, availableQuantity) {
        const newID = await this.getMaxID() + 1;
        const sku = new SKU(newID, description, weight, volume, price, notes);
        await this.database.storeSKU(sku, availableQuantity);
    }

    async getPositionFromDB(skuID) {
        return await this.database.getSKUPosition(skuID);
    }

    async deleteSKU(skuID) {
        await this.database.deleteSKU(skuID);
    }

    async getItemsBySupplierID(supplierID) {
        return await this.database.getItemsBySupplierID(supplierID);
    }
}
module.exports = Inventory;