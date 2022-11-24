const crypto = require('crypto');

const PASSWORD_LENGTH = 32;

function storeUser(db, data) {
    return new Promise((resolve, reject) => {

        const salt = crypto.randomBytes(PASSWORD_LENGTH);
        crypto.scrypt(data.password, salt, PASSWORD_LENGTH, (err, hashedPassword) => {
            if (err) {
                reject(err)
                return
            }
            const sql = `
            INSERT INTO USER(username,name,surname,password,salt,type)
            VALUES(?,?,?,?,?,?)`;

            db.run(sql, [data.username, data.name, data.surname, hashedPassword, salt, data.type], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        })
    });
}

function authenticateUser(db, data) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM USER
            WHERE username=?`;
        db.get(sql, [data.username], (err, row) => {
            if (err) {
                reject(err);
                return;
            } else if (row === undefined || row === null) {
                reject("Unauthorized");
                return;
            }

            const user = {
                id: row.userID,
                name: row.name,
                surname: row.surname,
                username: row.username,
                type: row.type
            }

            const salt = row.salt;
            crypto.scrypt(data.password, salt, PASSWORD_LENGTH, (err, hashedPassword) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
                    reject("Unauthorized");
                    return
                } else {
                    resolve(user);
                }
            });
        });
    });
}

function getUserByUsername(db, usr) {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT *
            FROM USER
            WHERE username=?`;
        db.all(sql, [usr], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const user = rows.map((u) => (
                {
                    id: u.userID,
                    username: u.username,
                    name: u.name,
                    surname: u.surname,
                    type: u.type
                }
            ));
            resolve(user);
        });
    });
}

function getSuppliers(db) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT userID, name, surname, username
            FROM USER
            WHERE type="supplier"`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((u) => (
                {
                    id: u.userID,
                    name: u.name,
                    surname: u.surname,
                    email: u.username
                }
            ));
            resolve(users);
        });
    });
}

function getUsers(db) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT userID, name, surname, username, type
            FROM USER
            WHERE type<>"manager"`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((u) => (
                {
                    id: u.userID,
                    name: u.name,
                    surname: u.surname,
                    email: u.username,
                    type: u.type
                }
            ));
            resolve(users);
        });
    });
}

function modifyRights(db, username, oldType, newType) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE USER
            SET type=?
            WHERE username=? AND type=?;`;
        db.run(sql, [newType, username, oldType], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Updated");
        });
    });
}

function deleteUser(db, username, type) {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM USER
            WHERE username=? AND type=?;`;
        db.run(sql, [username, type], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("User deleted: " + username + " (" + type + ")");
        });
    });
}

function deleteUsers(db) {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM USER`;
        db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

module.exports = {
    storeUser,
    authenticateUser,
    getUserByUsername,
    getSuppliers,
    getUsers,
    modifyRights,
    deleteUser,
    deleteUsers
};