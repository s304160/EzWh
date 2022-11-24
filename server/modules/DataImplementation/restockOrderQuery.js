function getRestockOrders(db) {
    return new Promise((resolve, reject) => {
        let sql =
            `   SELECT * 
                FROM RESTOCK_ORDER RO`;

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


function getTransportNote(db, restockOrderID) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT deliveryDate FROM TRANSPORT_NOTE
                    WHERE restockOrderID = ?`;

        db.get(sql, [restockOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getItemsByRestockOrder(db, restockOrderID) {
    return new Promise((resolve, reject) => {
        let sql =
            `   SELECT *
            FROM ITEM I, RESTOCK_ORDER_ITEM ROI
            WHERE I.itemID = ROI.itemID AND ROI.restockOrderID = ?`;

        db.all(sql, [restockOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getSKUItemsByRestockOrder(db, restockOrderID) {
    return new Promise((resolve, reject) => {
        let sql =
            `   SELECT S.skuID, S.rfid, ROI.itemID
                FROM SKUITEM S, RESTOCK_ORDER_ITEM ROI
                WHERE S.restockOrderID = ? AND S.restockOrderID = ROI.restockOrderID`;

        db.all(sql, [restockOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


function getReturnItemsOfRestockOrder(db, restockOrderID) {
    return new Promise((resolve, reject) => {
        let sql =
            `   SELECT S.skuID, S.rfid, ROI.itemID
                FROM SKUITEM S, TEST_RESULT T, RESTOCK_ORDER_ITEM ROI
                WHERE S.rfid = T.skuItemRfid AND ROI.restockOrderID=S.restockOrderID AND S.restockOrderID = ? AND result = 0`;

        db.all(sql, [restockOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


function getMaxRestockOrderID(db) {
    return new Promise((resolve, reject) => {
        // let sql2 = 
        //     `   SELECT MAX(orderID) AS max FROM RESTOCK_ORDER`;
        const sql =
            `   SELECT seq
                FROM sqlite_sequence
                WHERE name = "RESTOCK_ORDER"`
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.seq : 0);
        });
    })
}

function storeRestockOrder(db, issueDate, items, supplierID, newID) {
    return new Promise((resolve, reject) => {
        let sql1 =
            `   INSERT INTO RESTOCK_ORDER(issueDate, state, supplierID)
                VALUES (?, 'ISSUED',?)`;

        let sql3 =
            `   INSERT INTO RESTOCK_ORDER_ITEM(restockOrderID, itemID, qty)
                VALUES (?,?,?)`;

        db.run(sql1, [issueDate, supplierID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        items.forEach((i) => {
            if (i.getQuantity()) {
                db.run(sql3, [newID, i.getID(), i.getQuantity()], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                })
            }
        })

        resolve(true);
    })
}



function modifyRestockOrderState(db, restockOrderID, newState) {
    return new Promise((resolve, reject) => {
        let sql1 = `UPDATE RESTOCK_ORDER SET state = ?
                    WHERE orderID = ?`;

        let sql2 = `DELETE FROM RESTOCK_ORDER_ITEM
                WHERE restockOrderID = ?`;

        db.all(sql1, [newState, restockOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })

        if (newState === "ISSUED" || newState === "DELIVERY") {
            db.all(sql2, [restockOrderID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            })
        }
        resolve(true);
    })
}


function modifyRestockOrderSKUItems(db, restockOrderID, SKUItems) {
    return new Promise((resolve, reject) => {
        let sql =
            `   UPDATE SKUITEM 
                SET restockOrderID = ?
                WHERE rfid = ?`;

        SKUItems.forEach(skuItem => {
            db.all(sql, [restockOrderID, skuItem.rfid], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            })
        });
    })
}

function addRestockOrderTransportNote(db, restockOrderID, deliveryDate) {
    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO TRANSPORT_NOTE(restockOrderID, deliveryDate)
                    VALUES(?,?)`;

        db.all(sql, [restockOrderID, deliveryDate], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}


function deleteRestockOrder(db, restockOrderID) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM RESTOCK_ORDER
                    WHERE orderID = ?`;
        const sql2 =
            `   DELETE FROM RESTOCK_ORDER_ITEM
                WHERE restockOrderID = ?`

        db.run(sql, [restockOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        db.run(sql2, [restockOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function deleteRestockOrders(db) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM RESTOCK_ORDER`;

        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}


module.exports = {
    getRestockOrders,
    getTransportNote,
    getItemsByRestockOrder,
    getSKUItemsByRestockOrder,
    getReturnItemsOfRestockOrder,
    storeRestockOrder,
    modifyRestockOrderSKUItems,
    modifyRestockOrderState,
    addRestockOrderTransportNote,
    deleteRestockOrder,
    getMaxRestockOrderID,
    deleteRestockOrders
}