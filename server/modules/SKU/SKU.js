const DAO = require("../DataImplementation/DAO");

class SKU {
    database = new DAO("ezwhDb.sqlite");
    #skuID
    #description
    #weight
    #volume
    #price
    #notes
    #position
    #testDescriptors
    #availableQuantity
    #quantity
    constructor(id, description, weight,
        volume, price, notes) {

        this.#skuID = id;
        this.#description = description;
        this.#weight = weight;
        this.#volume = volume;
        this.#price = price;
        this.#notes = notes;
        this.#position = "";
        //this.skuItemList = [];
        this.#testDescriptors = [];
        //this.itemList = [];
    }

    //JSON
    toJSON() {
        return {
            id: this.#skuID,
            description: this.#description,
            weight: this.#weight,
            volume: this.#volume,
            price: this.#price,
            notes: this.#notes,
            availableQuantity: this.#availableQuantity,
            position: this.#position,
            testDescriptors: this.#testDescriptors,
            qty: this.#quantity
        }
    }

    // Getter
    getID() {
        return this.#skuID;
    }
    getDescription() {
        return this.#description;
    }
    getWeight() {
        return this.#weight;
    }
    getTotalWeight() {
        return this.#weight * this.#availableQuantity;
    }
    getVolume() {
        return this.#volume;
    }
    getTotalVolume() {
        return this.#volume * this.#availableQuantity;
    }
    getPrice() {
        return this.#price;
    }
    getNotes() {
        return this.#notes;
    }
    getPosition() {
        return this.#position;
    }
    getTestDescriptors() {
        return this.#testDescriptors;
    }
    getAvailableQuantity() {
        return this.#availableQuantity;
    }
    getQuantity() {
        return this.#quantity;
    }

    // Setter
    setDescription(description) {
        this.#description = description;
    }
    setWeight(weight) {
        this.#weight = weight;
    }
    setVolume(volume) {
        this.#volume = volume;
    }
    setPrice(price) {
        this.#price = price;
    }
    setNotes(notes) {
        this.#notes = notes;
    }
    setPosition(position) {
        this.#position = position;
    }
    addTestDescriptors(td) {
        this.#testDescriptors = this.#testDescriptors.concat(td.map((t) => t.testDescriptorID));
    }
    setAvailableQuantity(availableQuantity) {
        this.#availableQuantity = availableQuantity;
    }
    setQuantity(qty) {
        this.#quantity = qty;
    }


    getPositionID() {
        return this.position !== undefined ? this.position.id : "";
    }

    getTestDescriptorsID() {
        return this.testDescriptors.map((t) => t.id);
    }

    modify(newDescription, newWeight, newVolume, newNotes, newPrice, occupiedVolume, occupiedWeight) {
        this.description = newDescription;
        this.weight = newWeight;
        this.volume = newVolume;
        this.notes = newNotes;
        this.price = newPrice;
        this.position !== undefined ? updatePosition(occupiedVolume, occupiedWeight) : '';
    }

    checkForSpace(volume, weight) {
        return this.position.isAvailable(volume, weight);
    }

    addSkuItem(rfid, available, dateOfStock) {
        //todo
    }

    deleteSkuItemByRfid(rfid) {
        //todo
    }

    addTestDescriptor(name, procedureDescription) {
        //todo
    }

    deleteTestDescriptorById(id) {
        //todo
    }

    addItem(item) {
        //todo
    }

    deleteItem(id) {
        //todo
    }


}

module.exports = SKU;