const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const usersFile = 'users.json';

class User {
    constructor(fullName, email, password) {
        this.id = uuidv4();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    static findAll() {
        return readJSON(usersFile);
    }

    static findById(id) {
        const users = readJSON(usersFile);
        return users.find(user => user.id === id);
    }

    static findByEmail(email) {
        const users = readJSON(usersFile);
        return users.find(user => user.email === email);
    }

    static async create({ fullName, email, password }) {
        const users = readJSON(usersFile);
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User(fullName, email, hashedPass);
        users.push(newUser);
        writeJSON(usersFile, users);
        return newUser;
    }
}

module.exports = User;