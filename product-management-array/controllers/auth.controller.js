const userService = require("../services/user.service");

exports.showLoginForm = (req, res) => {
    res.render("auth/login", { error: null });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("auth/login", { error: "❌ Vui lòng nhập username và password" });
    }

    const user = userService.authenticate(username, password);
    if (!user) {
        return res.render("auth/login", { error: "❌ Username hoặc password không đúng" });
    }

    // Lưu session
    req.session.user = user;
    res.redirect("/");
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
        }
        res.redirect("/login");
    });
};