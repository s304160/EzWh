function getReturnOrders(db) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM RETURN_ORDER`;

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getProductsByReturnOrder(db, returnOrderID) {
    return new Promise((resolve, reject) => {
        let sql =
            `SELECT S.skuID, S.rfid, ROI.itemID, description, price
            FROM SKUITEM S, SKU, RESTOCK_ORDER_ITEM ROI
            WHERE returnOrderID = ? AND S.restockOrderID=ROI.restockOrderID
            AND SKU.skuID = S.skuID`;

        db.all(sql, [returnOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


function getMaxReturnOrderID(db) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT MAX(orderID) AS max FROM RETURN_ORDER"

        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.max ? row.max : 0);
        })
    });
}


function storeReturnOrder(db, returnDate, skuItems, restockOrderID, newID) {
    return new Promise((resolve, reject) => {
        let sql1 =
            `   INSERT INTO RETURN_ORDER(returnDate, restockOrderID)
                VALUES(?, ?)`;

        let sql2 =
            `   UPDATE SKUITEM SET returnOrderID = ?
                WHERE rfid = ?`;

        db.run(sql1, [returnDate, restockOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        skuItems.forEach((s) => {
            db.run(sql2, [newID, s.getRFID()], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            })
        });
        resolve(true);
    })
}


function deleteReturnOrder(db, returnOrderID) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM RETURN_ORDER
                    WHERE orderID = ?`;
        db.all(sql, [returnOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function deleteReturnOrders(db) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM RETURN_ORDER`;
        db.all(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}


module.exports = {
    getReturnOrders,
    getProductsByReturnOrder,
    getMaxReturnOrderID,
    storeReturnOrder,
    deleteReturnOrder,
    deleteReturnOrders
}