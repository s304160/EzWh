class TransportNote {
    #deliveryDate
    constructor(deliveryDate) {
        this.#deliveryDate = deliveryDate;
    }

    // JSON
    toJSON() {
        return {
            deliveryDate: this.#deliveryDate
        }
    }

    getDeliveryDate() {
        return this.#deliveryDate
    }
    setDeliveryDate(date) {
        this.#deliveryDate = date;
    }
}

module.exports = TransportNote;