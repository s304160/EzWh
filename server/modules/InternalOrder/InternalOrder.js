class InternalOrder {
    #id;
    #issueDate;
    #state;
    #customer;
    #skuList;
    #skuItemList;

    constructor(id, issueDate, state, customer, skuList, skuItemList) {
        this.#id = id;
        this.#issueDate = issueDate;
        this.#state = state;
        this.#customer = customer;
        this.#skuItemList = skuItemList ? skuItemList : [];
        this.#skuList = skuList ? skuList : [];
    }

    // To be changed
    toJSON() {
        return {
            id: this.#id,
            issueDate: this.#issueDate,
            state: this.#state,
            customerId: this.#customer,
            products: this.#skuList.map((s) => {
                if (this.state === "COMPLETED") {
                    return {
                        SKUId: s.skuID,
                        description: s.description,
                        price: s.price,
                        RFID: s.rfid
                    }
                } else {
                    return {
                        SKUId: s.skuID,
                        description: s.description,
                        price: s.price,
                        qty: s.quantity
                    }
                }
            })
        }
    }

    getID() { return this.#id; }
    getIssueDate() { return this.#issueDate; }
    getState() { return this.#state; }
    getCustomer() { return this.#customer; }
    getSkuList() { return this.#skuList; }

    setIssueDate(issueDate) { this.#issueDate = issueDate; }
    setState(state) { this.#state = state; }
    setCustomer(customer) { this.#customer = customer; }

    addSku(sku) {
        this.#skuList.push(sku);
    }

    addSKUItem(skuItem) {
        this.#skuItemList.push(skuItem);
    }

}

module.exports = InternalOrder;