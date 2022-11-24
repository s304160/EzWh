const UserManager = require("../../modules/User/UserManager");
const dao = require("./mock_dao/mock_userManager_dao");
const userManager = new UserManager(dao);

describe("user manager test",()=>{
    describe('get users',()=>{
        beforeEach(()=>{
            dao.getUsers.mockReset();
            dao.getUsers.mockReturnValue(
                [
                    {
                        id:1,
                        name:"Giuseppe",
                        surname:"Micco",
                        email:"user1@ezwh.com",
                        type:"customer"
                    },
                    {
                        id:2,
                        name:"Enrico",
                        surname:"Gholami",
                        email:"manager1@ezwh.com",
                        type:"manager"
                    }
                ]
            );
            dao.getSuppliers.mockReset();
            dao.getSuppliers.mockReturnValue(
                [
                    {
                        id:3,
                        name:"Ferdinando",
                        surname:"Jansen",
                        email:"supplier1@ezwh.com",
                        type:"supplier"
                    },
                    {
                        id:4,
                        name:"Erfan",
                        surname:"Fanuli",
                        email:"supplier2@ezwh.com",
                        type:"supplier"
                    }
                ]
            );
        });

        test('get user list',async ()=>{
            const users = await userManager.getUsers();
            expect(users).toEqual([
                {
                    id:1,
                    name:"Giuseppe",
                    surname:"Micco",
                    email:"user1@ezwh.com",
                    type:"customer"
                },
                {
                    id:2,
                    name:"Enrico",
                    surname:"Gholami",
                    email:"manager1@ezwh.com",
                    type:"manager"
                }
            ]);
        });

        test('get supplier list',async ()=>{
            const suppliers = await userManager.getSuppliers();
            expect(suppliers).toEqual([
                {
                    id:3,
                    name:"Ferdinando",
                    surname:"Jansen",
                    email:"supplier1@ezwh.com",
                    type:"supplier"
                },
                {
                    id:4,
                    name:"Erfan",
                    surname:"Fanuli",
                    email:"supplier2@ezwh.com",
                    type:"supplier"
                }
            ]);
        });

        test('authenticate user',async ()=>{
            await userManager.authenticate("aaa","bbb");
            expect(dao.authenticateUser.mock.calls[0][0]).toEqual(
                {
                    "username":"aaa",
                    "password":"bbb"
                }
            )
        });
    });

    describe("store users",()=>{
        test('store user',async()=>{
            await userManager.createUser("aaa","bbb","ccc","ddd","eee");
            expect(dao.storeUser.mock.calls[0][0]).toEqual(
                {
                    "username": "aaa",
                    "name":"bbb",
                    "surname":"ccc",
                    "password":"ddd",
                    "type":"eee",
                });
        });
    });

    describe("modify users",()=>{
        test("modify user rights",async ()=>{
            await userManager.modifyRights("aaa","bbb","ccc");
            expect(dao.modifyRights.mock.calls[0][0]).toBe("aaa");
            expect(dao.modifyRights.mock.calls[0][1]).toBe("bbb");
            expect(dao.modifyRights.mock.calls[0][2]).toBe("ccc");
        });
    });

    describe("delete users",()=>{
        test("delete user by username and type",async()=>{
            await userManager.deleteUser("aaa","bbb");
            expect(dao.deleteUser.mock.calls[0][0]).toBe("aaa");
            expect(dao.deleteUser.mock.calls[0][1]).toBe("bbb");
        })
    })
});