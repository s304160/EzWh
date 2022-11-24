function storeTestResult(db, resultID, rfid, testDescriptorID, date, result) {
    return new Promise((resolve, reject) => {
        const sql =
            `   INSERT INTO TEST_RESULT(date,result,skuItemRfid,testDescriptorID)
                VALUES(?,?,?,?);`;
        db.run(sql, [date, result, rfid, testDescriptorID], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function getTestResultsByRfid(db, rfid) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM TEST_RESULT
                WHERE skuItemRfid=?`;
        db.all(sql, [rfid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getTestResults(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT *
                FROM TEST_RESULT`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

function getMaxResultID(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   SELECT seq
                FROM sqlite_sequence
                WHERE name = "TEST_RESULT"`;
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.seq : 0);
        })
    })
}

function modifyTestResult(db, resultID, rfid, newTestDescriptorID, newDate, newResult) {
    return new Promise((resolve, reject) => {
        const sql =
            `   UPDATE TEST_RESULT
                SET testDescriptorID=?,
                    date=?,
                    result=?
                WHERE resultID=? AND skuItemRfid=?`;
        db.run(sql, [newTestDescriptorID, newDate, newResult, resultID, rfid], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        })

    })
}

function deleteTestResult(db, resultID, rfid) {
    return new Promise((resolve, reject) => {
        const sql =
            `   DELETE FROM TEST_RESULT
                WHERE resultID = ? AND skuItemRfid=?`;
        db.run(sql, [resultID, rfid], (err) => {
            if (err) {
                reject(err);
                return;
            }
        })
        resolve(true);
    })
}

function deleteTestResults(db) {
    return new Promise((resolve, reject) => {
        const sql =
            `   DELETE FROM TEST_RESULT`;
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
    storeTestResult,
    getTestResultsByRfid,
    getTestResults,
    getMaxResultID,
    modifyTestResult,
    deleteTestResult,
    deleteTestResults
}