function getSKUs(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM SKU S, INVENTORY I
                WHERE S.skuID = I.skuID`

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

function storeSKU(db, sku, availableQuantity) {
    return new Promise((resolve, reject) => {
        const query1 =
            `   INSERT INTO SKU(skuID, description, weight,
                        volume, price, notes)
                    VALUES(?,?,?,?,?,?);`;
        const query2 =
            `   INSERT INTO INVENTORY(skuID, availableQuantity)
                    VALUES(?,?);`;

        db.run(query1,
            [sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(),
            sku.getPrice(), sku.getNotes()],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
        db.run(query2,
            [sku.getID(), availableQuantity],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
        resolve(true);
    });
}

function getMaxID(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT seq
                FROM sqlite_sequence
                WHERE name = "SKU";`
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.seq : 0);
        });
    })
}

function getSKUPosition(db, skuID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT positionID
                FROM POSITION P, SKU S
                WHERE P.skuID = ?;`;
        db.all(sql, [skuID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length > 0) {
                resolve(rows[0].positionID);
                return;
            }
            resolve("");
        })
    })
}

function modifySKUByID(db, skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   UPDATE SKU
                SET description = ?,
                    weight = ?,
                    volume = ?,
                    price = ?,
                    notes = ?                                  
                WHERE skuID = ?;`;
        const sql2 =
            `   UPDATE INVENTORY
                SET availableQuantity=?
                WHERE skuID=?;`

        db.run(sql1,
            [newDescription, newWeight, newVolume, newPrice, newNotes, skuID],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
        db.run(sql2,
            [newAvailableQuantity, skuID],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
        resolve(true);
    });
}

function updateSKUPosition(db, skuID, positionID, newVolume, newWeight) {
    return new Promise((resolve, reject) => {
        const sql2 =
            `   UPDATE POSITION
                SET skuID = ?, occupiedVolume=?,occupiedWeight=?
                WHERE positionID= ?`;

        db.run(sql2, [skuID, newVolume, newWeight, positionID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(true);
    });
}

function deleteSKU(db, skuID) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   DELETE FROM SKU
                WHERE skuID=?;`;
        const sql2 =
            `   DELETE FROM INVENTORY
                WHERE skuID=?;`;
        db.run(sql1, [skuID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        db.run(sql2, [skuID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(true);
    });
}

function deleteAllSkus(db) {
    return new Promise((resolve, reject) => {
        const sql1 = `DELETE FROM SKU;`;
        const sql2 = `DELETE FROM INVENTORY;`


        db.run(sql1, (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        db.run(sql2, (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        resolve(true);
    });
}

module.exports = {
    getSKUs,
    storeSKU,
    getMaxID,
    getSKUPosition,
    modifySKUByID,
    updateSKUPosition,
    deleteSKU,
    deleteAllSkus
}