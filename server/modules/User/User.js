class User {
    constructor(name, surname, username, password, type) {
        this.name = name;
        this.username = username;
        this.surname = surname;
        this.password = password;
        this.type = type;
    }
}

module.exports = User;