const Position = require("./Position");
const Database = require('../DataImplementation/DAO');
const DAO = require("../DataImplementation/DAO");

class PositionManager {
    // database = new DAO("ezwhDb.sqlite");
    constructor(database) {
        this.positionIdCounter = 0
        this.positionList = [];
        this.database = database;
    }

    async isAvailable(positionID, newVolume, newWeight) {
        const space = await this.database.getMaxSpace(positionID);
        if (space.maxVolume >= newVolume && space.maxWeight >= newWeight) {
            return true;
        }
        return false;
    }

    async updateOccupiedSpace(positionID, newVolume, newWeight) {
        await this.database.updateOccupiedSpace(positionID, newVolume, newWeight);
    }

    async getPositions() {
        this.positionList = []
        const res = await this.database.getPositions();
        res.forEach((p) => {
            var pos = new Position(p.aisleID, p.aisleRow, p.aisleCol, p.maxWeight, p.maxVolume);
            pos.setSkuID(p.skuID);
            pos.setOccupiedVolume(p.occupiedVolume)
            pos.setOccupiedWeight(p.occupiedWeight)
            this.positionList.push(pos);
        });
        return this.positionList;
    }

    async getPositionByID(positionID) {
        await this.getPositions();
        return this.positionList.find((p) => p.getPositionID() == positionID);
    }

    async storePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        await this.database.storePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
    }

    async modifyPositionByID(positionID, newAisleID, newRow, newCol,
        newMaxWeight, newMaxVolume, newOccupiedWeight,
        newOccupiedVolume) {
        await this.database.modifyPositionByID(
            positionID,
            newAisleID,
            newRow,
            newCol,
            newMaxWeight,
            newMaxVolume,
            newOccupiedWeight,
            newOccupiedVolume
        );
    }

    async modifyPositionID(oldId, newId) {
        await this.database.modifyPositionID(oldId, newId);
    }

    async deletePositionByID(positionID) {
        await this.database.deletePositionByID(positionID);
    }

}

module.exports = PositionManager;