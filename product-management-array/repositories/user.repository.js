const users = require("../data/user.data");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    findByUsername(username) {
        return users.find(u => u.username === username) || null;
    },

    findById(userId) {
        return users.find(u => u.userId === userId) || null;
    },

    create(userData) {
        const newUser = {
            userId: uuidv4(),
            username: userData.username,
            password: userData.password,
            role: userData.role || "staff",
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        return newUser;
    },

    getAll() {
        return users;
    },

    update(userId, userData) {
        const user = this.findById(userId);
        if (user) {
            if (userData.username) user.username = userData.username;
            if (userData.role) user.role = userData.role;
        }
        return user;
    },

    delete(userId) {
        const index = users.findIndex(u => u.userId === userId);
        if (index > -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    }
};