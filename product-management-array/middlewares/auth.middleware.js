// Middleware kiểm tra user đã đăng nhập
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

// Middleware kiểm tra role admin
const checkAdminRole = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).render("error", {
            message: "❌ Bạn không có quyền truy cập tính năng này. Chỉ admin được phép."
        });
    }
    next();
};

module.exports = {
    checkAuth,
    checkAdminRole
};