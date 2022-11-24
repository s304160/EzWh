const DAO = require("../DataImplementation/DAO");

class UserManager {

    static MANAGER = "manager";
    static CUSTOMER = "customer";
    static QUALITY_EMPLOYEE = "qualityEmployee";
    static CLERK = "clerk";
    static DELIVERY_EMPLOYEE = "deliveryEmployee";
    static SUPPLIER = "supplier";

    // database = new DAO("ezwhDb.sqlite");
    constructor(database) {
        this.database = database;
    }

    async getUsers() {
        return await this.database.getUsers();
    }

    async getSuppliers() {
        return await this.database.getSuppliers();
    }

    async createUser(username, name, surname, password, type) {
        return await this.database
            .storeUser(
                {
                    "username": username,
                    "name": name,
                    "surname": surname,
                    "password": password,
                    "type": type,
                });
    }

    async authenticate(username, password) {
        return await this.database
            .authenticateUser(
                {
                    "username": username,
                    "password": password
                });
    }

    async modifyRights(username, oldType, newType) {
        return await this.database.modifyRights(username, oldType, newType);
    }

    async deleteUser(username, type) {
        return await this.database.deleteUser(username, type);
    }

}

module.exports = UserManager;