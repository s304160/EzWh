class SKUItem {
    #rfid
    #available
    #dateOfStock
    #skuID

    constructor(rfid, available, skuID, dateOfStock) {
        this.#rfid = rfid;
        this.#available = available;
        this.#skuID = skuID;
        this.#dateOfStock = dateOfStock;
        // this.testResultList = [];
    }

    // JSON
    toJSON() {
        return {
            RFID: this.#rfid,
            SKUId: this.#skuID,
            Available: this.#available,
            DateOfStock: this.#dateOfStock,
        }
    }
    // Getter
    getRFID() {
        return this.#rfid;
    }
    getAvailable() {
        return this.#available;
    }
    getSkuID() {
        return this.#skuID;
    }
    getDateOfStock() {
        return this.#dateOfStock;
    }

    setAvailable(available) {
        this.#available = available;
    }
    setSkuID(skuID) {
        this.#skuID = skuID;
    }
    setDateOfStock(dateOfStock) {
        this.#dateOfStock = dateOfStock;
    }


    addTestResult(testDescriptorId, date, result) {
        //todo
    }

    deleteTestResultById(testResultId) {
        //todo
    }
}

module.exports = SKUItem;