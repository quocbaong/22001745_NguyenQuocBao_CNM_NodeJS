const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");

module.exports = {
    async register(userData) {
        // Kiểm tra user đã tồn tại
        const existingUser = userRepository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error("Username already exists");
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(userData.password, 10);

        // Tạo user
        const user = userRepository.create({
            username: userData.username,
            password: hashedPassword,
            role: userData.role || "staff"
        });

        return this.getUserWithoutPassword(user);
    },

    authenticate(username, password) {
        const user = userRepository.findByUsername(username);
        if (!user) {
            return null;
        }

        // So sánh password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        // Không trả password
        return this.getUserWithoutPassword(user);
    },

    getUserById(userId) {
        const user = userRepository.findById(userId);
        if (!user) return null;
        return this.getUserWithoutPassword(user);
    },

    getUserWithoutPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};