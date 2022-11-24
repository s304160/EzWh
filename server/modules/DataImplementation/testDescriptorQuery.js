function getSKUTestDescriptors(db, skuID) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM TEST_DESCRIPTOR TD, SKU_TESTDESCR STD
                WHERE TD.testDescriptorID = STD.testDescriptorID AND STD.skuID = ?`;
        db.all(sql, [skuID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getTestDescriptors(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM TEST_DESCRIPTOR TD, SKU_TESTDESCR STD
                WHERE TD.testDescriptorID = STD.testDescriptorID`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function storeTestDescriptor(db, name, procedureDescription, skuID, newId) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   INSERT INTO TEST_DESCRIPTOR(name,procedureDescription)
                VALUES(?,?)`;
        const sql2 =
            `   INSERT INTO SKU_TESTDESCR(skuID,testDescriptorID)
                VALUES(?,?)`;
        db.run(sql1, [name, procedureDescription], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        db.run(sql2, [skuID, newId], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function getTDMaxID(db) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   SELECT seq
                FROM sqlite_sequence
                WHERE name = "TEST_DESCRIPTOR"`;

        db.get(sql1, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.seq : 0);
        })
    })
}

function modifyTestDescriptorByID(db, testDescriptorID, newName, newProcedureDescription, newSkuID) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   UPDATE TEST_DESCRIPTOR
                SET name=?,
                    procedureDescription=?
                WHERE testDescriptorID=?`;
        const sql2 =
            `   UPDATE SKU_TESTDESCR
                SET skuID=?
                WHERE testDescriptorID=?`
        db.run(sql1, [newName, newProcedureDescription, testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        db.run(sql2, [newSkuID, testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function deleteTestDescriptor(db, testDescriptorID) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `   DELETE FROM TEST_DESCRIPTOR
                WHERE testDescriptorID=?`;
        const sql2 =
            `   DELETE FROM SKU_TESTDESCR
                WHERE testDescriptorID=?`;
        db.run(sql1, [testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        db.run(sql2, [testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function deleteTestDescriptors(db) {
    return new Promise((resolve, reject) => {
        const sql1 =
            `DELETE FROM TEST_DESCRIPTOR`;

        db.run(sql1, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        db.run(sql2, [testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}


module.exports = {
    getSKUTestDescriptors,
    getTestDescriptors,
    storeTestDescriptor,
    getTDMaxID,
    modifyTestDescriptorByID,
    deleteTestDescriptor,
    deleteTestDescriptors
}