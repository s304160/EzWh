function getItems(db) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ITEM`;

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getItemsBySupplierID(db, supplierId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ITEM
                   WHERE supplierId=?`;

        db.all(sql, [itemID, supplierID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}


function storeItem(db, itemID, description, price, skuID, supplierID) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO ITEM(itemID, description, price, skuID, supplierID)
                    VALUES(?,?,?,?,?)`;

        db.all(sql, [itemID, description, price, skuID, supplierID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function modifyItem(db, itemID, newDescription, newPrice) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE ITEM SET                    
                    description = ?,
                    price = ?
                    WHERE itemID = ?`;

        db.all(sql, [newDescription, newPrice, itemID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function deleteItem(db, itemID) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ITEM
                    WHERE itemID = ?`;

        db.all(sql, [itemID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
function deleteItemBySupplierID(db, itemID, supplierID) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ITEM
                    WHERE itemID = ? AND supplierId=?`;

        db.all(sql, [itemID, supplierID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}
function deleteItems(db) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM ITEM`;

        db.all(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })
    })
}

function checkSupplierSells(db, supplierID, skuID, itemID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM ITEM
                WHERE supplierID=? AND (skuID = ? OR itemID=?);`;
        db.get(sql, [supplierID, skuID, itemID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row)
        })
    })
}

module.exports = {
    getItems,
    getItemsBySupplierID,
    storeItem,
    modifyItem,
    deleteItem,
    deleteItemBySupplierID,
    deleteItems,
    checkSupplierSells
}