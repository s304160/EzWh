function getInternalOrders(db) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM INTERNAL_ORDER`;

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
            return;
        })
    })
}

function getProductsOfInternalOrder(db, internalOrderID, state) {
    return new Promise((resolve, reject) => {
        let sql;
        if (state === "COMPLETED")
            sql = `SELECT SKU.skuID, description, price, rfid
                    FROM SKUITEM, SKU
                    WHERE SKUITEM.skuID = SKU.skuID
                    AND internalOrderID = ?`;
        else
            sql = `SELECT SKU.skuID, description, price, qty
                    FROM SKU, INTERNAL_ORDER_SKUITEM
                    WHERE SKU.skuID = INTERNAL_ORDER_SKUITEM.skuID
                    AND INTERNAL_ORDER_SKUITEM.internalOrderID = ?`;

        db.all(sql, [internalOrderID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getMaxInternalOrderID(db) {
    return new Promise((resolve, reject) => {
        let sql =
            `   SELECT MAX(orderID) AS max FROM INTERNAL_ORDER`;
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.max ? row.max : 0);
        });
    })
}



function storeInternalOrder(db, issueDate, customerID, skus, newID) {
    return new Promise((resolve, reject) => {
        const sql1 = `INSERT INTO INTERNAL_ORDER(issueDate, state, customerID)
                    VALUES (?, 'ISSUED', ?)`;

        const sql2 = `INSERT INTO INTERNAL_ORDER_SKUITEM(internalOrderID, skuID, qty)        
                    VALUES (?,?,?)`;

        db.serialize(() => {
            db.run(sql1, [issueDate, customerID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            db.run(sql2, [newID, skus[0].getID(), skus[0].getQuantity()], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
        })
        // skus.forEach((s)=>{                                   
        //     db.run(sql2, [newID, s.getID(), s.getQuantity()],(err)=>{
        //         if(err){
        //             reject(err);
        //             return;
        //         }
        //         db.run(sql1, [issueDate, customerID], (err)=>{
        //             if(err){
        //                 reject(err);
        //                 return;
        //             }
        //         });
        //     })            
        // }) 

        resolve(true);
    })
}


function modifyInternalOrder(db, internalOrderID, newState, skuItemList) {
    return new Promise((resolve, reject) => {
        let sql1 = `UPDATE INTERNAL_ORDER SET state = ?
                    WHERE orderID = ?`;

        let sql2 = `UPDATE SKUITEM SET internalOrderID = ?
                    WHERE rfid = ?`;

        db.run(sql1, [newState, internalOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })

        if (newState === "COMPLETED" && skuItemList !== undefined) {
            skuItemList.forEach(skuItem => {
                db.run(sql2, [internalOrderID, skuItem.RFID], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                })
            });
        }
        resolve(true);
    })
}



function deleteInternalOrder(db, internalOrderID) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM INTERNAL_ORDER
                    WHERE orderID = ?`;

        db.all(sql, [internalOrderID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function deleteInternalOrders(db) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM INTERNAL_ORDER`;

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
    getInternalOrders,
    getProductsOfInternalOrder,
    getMaxInternalOrderID,
    storeInternalOrder,
    modifyInternalOrder,
    deleteInternalOrder,
    deleteInternalOrders
}