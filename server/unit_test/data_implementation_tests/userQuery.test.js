const DAO = require('../../modules/DataImplementation/DAO')
const test_user = require('./test_modules/test_user');


const db = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_userQuery.sqlite`);

describe('testing userQuery', () => {
    beforeAll(async () => {
            await db.destroyDB().then(async () => await db.startDB())
        });
    const d1 = { username: "username1", name: "name", surname: "surname", password: "password1", type: "supplier" };
    const d2 = { username: "username2", name: "name", surname: "surname", password: "password2", type: "customer" };
    const d3 = { username: "username3", name: "name", surname: "surname", password: "password3", type: "manager" };
    const d4 = { username: "username2", name: "name", surname: "surname", password: "password2", type: "supplier" };

    describe('get users',()=>{
        beforeAll(async ()=>{
            await db.deleteUsers();
        })
        test_user.test_dbIsClean(db);
        test_user.test_newUser(db,d1);
        test_user.test_newUser(db,d2);
        test_user.test_newUser(db,d3);
        test_user.test_newUser(db,d4);
        test_user.test_getUser(db,"username2", 2);
        test_user.test_getSuppliers(db,2);
    })
    
    describe('check authentication',()=>{
        beforeAll(async ()=>{
            await db.deleteUsers();
        })
        test_user.test_dbIsClean(db);
        test_user.test_newUser(db,d1);
        test_user.test_newUser(db,d2);
        test_user.test_authenticate(db, "username1", "password1", 1);
    })

    describe('modify users',()=>{
        beforeAll(async ()=>{
            await db.deleteUsers();
        })
        test_user.test_dbIsClean(db);
        test_user.test_newUser(db,d1);
        test_user.test_newUser(db,d2);
        test_user.test_newUser(db,d3);
        test_user.test_newUser(db,d4);
        test_user.test_modifyRights(db,"username1", "supplier", "customer");
        test_user.test_getSuppliers(db,1);
    })

    describe("delete users",()=>{
        beforeAll(async ()=>{
            await db.deleteUsers();
        })
        test_user.test_dbIsClean(db);
        test_user.test_newUser(db,d1);
        test_user.test_newUser(db,d2);
        test_user.test_newUser(db,d3);
        test_user.test_newUser(db,d4);
        test_user.test_getUser(db,"username2", 2);
        test_user.test_deleteUser(db,"username2", "customer");
        test_user.test_getUser(db,"username2", 1);
        test_user.test_deleteUser(db,"username2", "customer");
        test_user.test_getUser(db,"username2", 1);
    });
});