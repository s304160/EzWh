function storePosition(db, positionID, aisleID, row, col, maxWeight, maxVolume) {
    return new Promise((resolve, reject) => {
        const sql =
            `   INSERT INTO POSITION(
                    positionID, aisleID, aisleRow, aisleCol, maxWeight, 
                    maxVolume, occupiedWeight, occupiedVolume)
                VALUES(?,?,?,?,?,?,?,?)`;
        db.run(sql, [positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function getPositions(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM POSITION`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

function getPositionByID(db, positionID) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM POSITION
            WHERE positionID=?`;
        db.all(sql, [positionID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const position = rows.map((p) => (
                {
                    positionID: p.positionID,
                    aisleID: p.aisleID,
                    row: p.aisleRow,
                    col: p.aisleCol,
                    maxWeight: p.maxWeight,
                    maxVolume: p.maxVolume,
                    occupiedWeight: p.occupiedWeight,
                    occupiedVolume: p.occupiedVolume
                }
            ));
            resolve(position);
        });
    });
}

function modifyPositionByID(db, oldID, newAisleId, newRow, newCol, newMaxWeight, newMaxVolume,
    newOccupiedWeight, newOccupiedVolume) {

    const newID = newAisleId.concat(newRow, newCol)
    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE POSITION 
                SET
                    positionID = ?,
                    aisleID = ?,
                    aisleRow = ?,
                    aisleCol = ?,
                    maxWeight = ?,
                    maxVolume = ?,
                    occupiedWeight = ?,
                    occupiedVolume = ?
                WHERE positionID = ?`;
        db.run(sql,
            [newID, newAisleId, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight,
                newOccupiedVolume, oldID],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
    });
}

function modifyPositionID(db, oldPositionID, newPositionID) {

    const newAisleID = newPositionID.slice(0, 4);
    const newRow = newPositionID.slice(4, 8);
    const newColumn = newPositionID.slice(8, 12);

    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE POSITION
                SET
                    positionID = ?,
                    aisleID= ?,
                    aisleRow = ?,
                    aisleCol = ?
                WHERE positionID=?`;
        db.run(sql,
            [newPositionID, newAisleID, newRow, newColumn, oldPositionID],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
    });
}

function deletePositionByID(db, positionID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   DELETE FROM POSITION              
                WHERE positionID=?`;
        db.all(sql, [positionID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function getSKUPosition(db, skuID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT positionID
                FROM POSITION P
                WHERE P.skuID = ?`;
        db.all(sql, [skuID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getAvailableSpace(db, positionID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT (maxWeight-occupiedWeight) AS availableWeight,
                    (maxVolume-occupiedVolume) AS availableVolume
                FROM POSITION
                WHERE positionID=?;`;
        db.all(sql, [positionID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0]);
        })
    })
}

function updateOccupiedSpace(db, positionID, newVolume, newWeight) {
    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE POSITION
                SET occupiedVolume=?,occupiedWeight=?
                WHERE positionID=?;`;
        db.run(sql, [newVolume, newWeight, positionID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
function resetPosition(db, positionID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE POSITION
                SET skuID = null,
                    occupiedWeight = 0,
                    occupiedVolume = 0
                WHERE positionID = ?`;
        db.run(sql, [positionID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
function getMaxSpace(db, positionID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT maxVolume,maxWeight
                FROM POSITION
                WHERE positionID=?;`;
        db.all(sql, [positionID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0]);
        })
    })
};

function deletePositions(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `DELETE FROM POSITION`;
        db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
module.exports = {
    storePosition,
    getPositions,
    getPositionByID,
    modifyPositionByID,
    modifyPositionID,
    deletePositionByID,
    getSKUPosition,
    getAvailableSpace,
    updateOccupiedSpace,
    resetPosition,
    getMaxSpace,
    deletePositions
}