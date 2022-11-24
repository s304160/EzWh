class ReturnOrder {

    #id;
    #returnDate;
    #restockOrder;
    #skuItemList;

    constructor(id, returnDate, restockOrder, skuItemList) {
        this.#id = id;
        this.#returnDate = returnDate;
        this.#restockOrder = restockOrder;
        this.#skuItemList = skuItemList ? skuItemList : [];
    }

    toJSON() {
        return {
            id: this.#id,
            returnDate: this.#returnDate,
            restockOrderId: this.#restockOrder,
            //skuItemList: this.#skuItemList

            products: this.#skuItemList.map((s) => {
                return {
                    SKUId: s.skuID,
                    description: s.description,
                    price: s.price,
                    RFID: s.rfid
                }
            }),
        }
    }

    getID() { return this.#id; }
    getReturnDate() { return this.#returnDate; }
    getRestockOrder() { return this.#restockOrder; }
    getSkuItemList() { return this.#skuItemList; }

    setReturnDate(returnDate) { this.#returnDate = returnDate; }
    setReStockOrder(restockOrder) { this.#restockOrder = restockOrder; }

    addSkuItem(skuItem) {
        this.#skuItemList.push(skuItem);
    }

    deleteSkuItemByRfid(rfid) {
        this.#skuItemList.filter((skuItem) => {
            return skuItem.rfid !== rfid;
        })
    }
}

module.exports = ReturnOrder;