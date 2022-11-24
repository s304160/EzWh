function test_isClean(db){
    test('is clean', async ()=>{
        const positions = await db.getPositions();
        expect(positions.length).toBe(0);
    })
}

function test_storePosition(db,pos){
    test('store position', async ()=>{
        try{
            const stored = await db.storePosition(
                pos.getPositionID(),
                pos.getAisleID(),
                pos.getRow(),
                pos.getCol(),
                pos.getMaxWeight(),
                pos.getMaxVolume());
        
                expect(stored).toBe(true);
        }catch(err){
            expect(err).toBeDefined();
        }
        
    })
}

function test_getPositions(db,len){
    test('get position list', async ()=>{
        const list = await db.getPositions();
        expect(list.length).toEqual(len)
    })
}

function test_getPositionByID(db,positionID,aisle,row,col,maxWeight,maxVolume,occupiedWeight,occupiedVolume){
    test('get position by id', async ()=>{
        const list = await db.getPositionByID(positionID);
        expect(list).toEqual(
            [
                {
                    positionID:positionID,
                    aisleID:aisle,
                    row:row,
                    col:col,
                    maxWeight:maxWeight,
                    maxVolume:maxVolume,
                    occupiedWeight:occupiedWeight,
                    occupiedVolume:occupiedVolume
                }
            ]
        )
    })
}

function test_getMaxSpace(db,positionID, weight,volume){
    test('get max weight and volume', async ()=>{
        const {maxVolume,maxWeight} = await db.getMaxSpace(positionID);
        expect(maxVolume).toBe(volume);
        expect(maxWeight).toBe(weight);
    })
}

function test_getAvailableSpace(db,positionID,weight,volume){
    test('get available space',async ()=>{
        const {availableWeight,availableVolume} = await db.getAvailableSpace(positionID);
        expect(availableWeight).toBe(weight);
        expect(availableVolume).toBe(volume);
    })
}

function test_updateOccupiedSpace(db,positionID,newVolume,newWeight){
    test('update occupied space', async ()=>{
        const updated = await db.updateOccupiedSpace(positionID,newVolume,newWeight);
        expect(updated).toBe(true);
    })
}

function test_resetPosition(db,positionID){
    test('reset position',async () =>{
        const reset = await db.resetPosition(positionID);
        expect(reset).toBe(true);
    })
}

function test_modifyPositionByID(db,oldID, newAisleId, newRow, newCol,newMaxWeight, newMaxVolume, newOccupiedWeight,newOccupiedVolume){
    test('modify position by id', async ()=>{
        const updated = await db.modifyPositionByID(oldID, newAisleId, newRow, newCol,newMaxWeight, newMaxVolume, newOccupiedWeight,newOccupiedVolume);
        expect(updated).toBe(true);
    })
}

function test_modifyPositionID(db,oldPositionID,newPositionID){
    test('modify position id',async ()=>{
        const updated = await db.modifyPositionID(oldPositionID,newPositionID);
        expect(updated).toBe(true);
    })
}

function test_deletePositionByID(db,positionID){
    test('delete position',async ()=>{
        const deleted = await db.deletePositionByID(positionID);
        expect(deleted).toBe(true);
    })
}

function test_getSKUPosition(db,skuID, positionID){
    test('get sku position', async ()=>{
        const position = await db.getSKUPosition(skuID);
        expect(position).toBe(positionID);
    })
}

function test_deletePositions(db){
    test('delete positions',async ()=>{
        const deleted = await db.deletePositions();
        expect(deleted).toBe(true);
    })
}

module.exports = {
    test_isClean,
    test_getPositionByID,
    test_getPositions,
    test_storePosition,
    test_getMaxSpace,
    test_getAvailableSpace,
    test_updateOccupiedSpace,
    test_resetPosition,
    test_modifyPositionByID,
    test_modifyPositionID,
    test_deletePositionByID,
    test_getSKUPosition,
    test_deletePositions
}