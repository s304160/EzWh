function storeSKUItem(db, rfid, available, skuID, dateOfStock) {
    return new Promise((resolve, reject) => {
        const sql =
            `   INSERT INTO SKUITEM(rfid,available,skuID,dateOfStock)
                VALUES (?,?,?,?);`
        db.run(sql, [rfid, available, skuID, dateOfStock], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
function getSkuItems(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM SKUITEM`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getSkuItemsAvailable(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM SKUITEM
                WHERE available=1;`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getSKUItemsByRestockOrder(db, restockOrderId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT skuID, rfid FROM SKUITEM
                    WHERE restockOrderID = ?`;

        db.run(sql, [restockOrderId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getReturnItemsOfRestockOrder(db, restockOrderId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT skuID, rfid
                    FROM SKUITEM, TEST_RESULT
                    WHERE restockOrderID = ?
                    AND SKUITEM.rfid = TEST_RESULT.skuItemRfid
                    AND result = 0`;

        db.run(sql, [restockOrderId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function modifySkuItem(db, oldRFID, newRFID, newAvailable, newDateOfStock) {
    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE SKUITEM
                SET rfid=?,
                    available=?,
                    dateOfStock=?
                WHERE rfid=?;`;
        db.run(sql, [newRFID, newAvailable, newDateOfStock, oldRFID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function deleteSkuItem(db, rfid) {
    return new Promise((resolve, reject) => {
        const sql =
            `   DELETE FROM SKUITEM
                WHERE rfid=?;`;
        db.run(sql, [rfid], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function deleteSkuItems(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   DELETE FROM SKUITEM`;
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
module.exports = {
    storeSKUItem,
    getSkuItems,
    getSkuItemsAvailable,
    getSKUItemsByRestockOrder,
    getReturnItemsOfRestockOrder,
    modifySkuItem,
    deleteSkuItem,
    deleteSkuItems
}