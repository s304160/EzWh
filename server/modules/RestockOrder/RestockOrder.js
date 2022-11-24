class RestockOrder {

    #id;
    #issueDate;
    #state;
    #supplier;
    #itemList;
    #transportNote;
    #skuItemList;

    constructor(id, issueDate, state, supplier) {
        this.#id = id;
        this.#issueDate = issueDate;
        //Accepted values: [ISSUED, DELIVERY, DELIVERED, TESTED, COMPLETEDRETURN, COMPLETED]
        this.#state = state;
        this.#supplier = supplier;
        this.#itemList = [];
        this.#skuItemList = [];
    }

    toJSON() {
        return {
            id: this.#id,
            issueDate: this.#issueDate,
            state: this.#state,
            supplierId: this.#supplier,
            itemList: this.#itemList.map((i) => {
                return {
                    SKUId: i.getID(),
                    description: i.getDescription(),
                    price: i.getPrice(),
                    qty: i.getQuantity()
                }
            }),
            transportNote: this.#transportNote,
            skuItems: this.#skuItemList
        }
    }

    getID() { return this.#id; }
    getIssueDate() { return this.#issueDate; }
    getState() { return this.#state; }
    getTransportNote() { return this.#transportNote; }
    getSupplier() { return this.#supplier; }
    getSkuItemList() { return this.#skuItemList; }
    getItemList() { return this.#itemList; }

    setIssueDate(issueDate) { this.#issueDate = issueDate; }
    setState(state) { this.#state = state; }
    setTransportNote(transportNote) { this.#transportNote = transportNote; }
    setSupplier(supplier) { this.#supplier = supplier; }

    addSKUItem(skuItem) {
        this.#skuItemList.push(skuItem);
    }

    addItem(item) {
        this.#itemList.push(item);
    }

    deleteSKUItemByRfid(rfid) {
        this.#skuItemList.filter((skuItem) => {
            return skuItem.rfid !== rfid;
        })
    }

    deleteItemById(id) {
        this.#itemList.delete(id);
    }

    emptySkuItemList() {
        this.#skuItemList = [];
    }
}

module.exports = RestockOrder;