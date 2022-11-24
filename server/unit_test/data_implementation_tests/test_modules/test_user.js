function test_dbIsClean(db) {
    test('db is clean', async () => {
        const res = await db.getUsers();
        expect(res.length).toBe(0);
    });
}

function test_newUser(db, data) {
    test('create new user', async () => {
        const success = await db.storeUser(data);
        expect(success).toStrictEqual(true);
    });
}

function test_getUser(db, username, len) {
    test('get user by username', async () => {
        const user = await db.getUserByUsername(username);
        expect(user.length).toBe(len);
    });
}

function test_authenticate(db, username, password) {
    test('authenticate a user', async () => {
        try {
            const user = await db.authenticateUser({ username: username, password: password });
            expect(user.username).toEqual(username);
        }
        catch (err) {
            console.log(err)
            expect(err).toBe("Unauthorized")
        }

    });
}

function test_getSuppliers(db, len) {
    test('get suppliers', async () => {
        const user = await db.getSuppliers();
        expect(user.length).toEqual(len);
    });
}

function test_modifyRights(db, username, oldType, newType) {
    test('modify rights', async () => {
        const result = await db.modifyRights(username, oldType, newType);
        expect(result).toEqual("Updated");
    });
}


function test_deleteUser(db, username, type) {
    test('delete user', async () => {
        const res = await db.deleteUser(username, type);
        expect(res).toBe("User deleted: " + username + " (" + type + ")");
    });
}

function test_deleteUsers(db) {
    test('delete users', async () => {
        const res = await db.deleteUser();
        expect(res).toBe(true);
    });
}

module.exports = {
    test_dbIsClean,
    test_getUser,
    test_newUser,
    test_getSuppliers,
    test_authenticate,
    test_modifyRights,
    test_deleteUser,
    test_deleteUsers
}