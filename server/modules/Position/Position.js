class Position {
    #positionID
    #aisleID
    #row
    #col
    #maxWeight
    #maxVolume
    #occupiedWeight
    #occupiedVolume
    #skuID
    //#skuItemMap 
    constructor(aisleID, row, col, maxWeight, maxVolume) {
        this.#positionID = aisleID + row + col;
        this.#aisleID = aisleID;
        this.#row = row;
        this.#col = col;
        this.#maxWeight = maxWeight;
        this.#maxVolume = maxVolume;
        this.#occupiedWeight = 0;
        this.#occupiedVolume = 0;
        //this.#skuItemMap = new Map();
    }
    //JSON
    toJSON() {
        return {
            positionID: this.#positionID,
            aisleID: this.#aisleID,
            row: this.#row,
            col: this.#col,
            maxWeight: this.#maxWeight,
            maxVolume: this.#maxVolume,
            occupiedWeight: this.#occupiedWeight,
            occupiedVolume: this.#occupiedVolume
        }
    }

    // Getter
    getPositionID() {
        return this.#positionID;
    }
    getAisleID() {
        return this.#aisleID;
    }
    getRow() {
        return this.#row;
    }
    getCol() {
        return this.#col;
    }
    getMaxWeight() {
        return this.#maxWeight;
    }
    getMaxVolume() {
        return this.#maxVolume;
    }
    getOccupiedWeight() {
        return this.#occupiedWeight;
    }
    getOccupiedVolume() {
        return this.#occupiedVolume;
    }
    getSkuID() {
        return this.#skuID;
    }

    // Setter
    setPositionID(positionID) {
        this.#positionID = positionID;
    }
    setAisleID(aisleID) {
        this.#aisleID = aisleID;
    }
    setRow(row) {
        this.#row = row;
    }
    setCol(col) {
        this.#col = col;
    }
    setMaxWeight(maxWeight) {
        this.#maxWeight = maxWeight;
    }
    setMaxVolume(maxVolume) {
        this.#maxVolume = maxVolume;
    }
    setOccupiedWeight(occupiedWeight) {
        this.#occupiedWeight = occupiedWeight;
    }
    setOccupiedVolume(occupiedVolume) {
        this.#occupiedVolume = occupiedVolume;
    }
    setSkuID(skuID) {
        this.#skuID = skuID;
    }

    isAvailable(volume, weight) {
        if ((this.#occupiedVolume + volume) <= this.#maxVolume &&
            (this.#occupiedWeight + weight) <= this.#maxWeight) {
            return true;
        }
        return false;
    }

    updatePosition(volume, weight) {
        this.#occupiedVolume += volume;
        this.#occupiedWeight += weight;
    }

    addSkuItem(newSkuItem, dateOfStock) {
        //Add newSku to skuItemMap
        this.skuItemMap.set(newSkuItem, dateOfStock)
    }

    deleteskuItem(rfid) {
        //remove skuItem with specific rfid from skuItemMap
    }
}

module.exports = Position;