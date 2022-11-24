class Item {

    #id;
    #description;
    #price;
    #sku;
    #supplier;
    #quantity
    constructor(id, description, price, sku, supplier) {
        this.#id = id;
        this.#description = description;
        this.#price = price;
        this.#sku = sku;
        this.#supplier = supplier;
    }

    toJSON() {
        return {
            id: this.#id,
            description: this.#description,
            price: this.#price,
            SKUId: this.#sku,
            supplierId: this.#supplier,
            qty: this.#quantity
        }
    }

    getID() { return this.#id; }
    getDescription() { return this.#description; }
    getPrice() { return this.#price; }
    getSku() { return this.#sku; }
    getSupplier() { return this.#supplier; }
    getQuantity() {
        return this.#quantity;
    }

    setDescription(description) { this.#description = description; }
    setPrice(price) { this.#price = price; }
    setSku(sku) { this.#sku = sku; }
    setSupplier(supplier) { this.#supplier = supplier; }
    setQuantity(qty) {
        this.#quantity = qty;
    }

}

module.exports = Item;