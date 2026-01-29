const bcrypt = require("bcryptjs");

// Dữ liệu mẫu với password đã hash
let users = [{
        userId: "admin-001",
        username: "admin",
        password: bcrypt.hashSync("admin123", 10),
        role: "admin",
        createdAt: new Date().toISOString()
    },
    {
        userId: "staff-001",
        username: "staff",
        password: bcrypt.hashSync("staff123", 10),
        role: "staff",
        createdAt: new Date().toISOString()
    }
];

module.exports = users;