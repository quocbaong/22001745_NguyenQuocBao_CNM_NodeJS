const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const productController = require("./controllers/product.controller");
const categoryController = require("./controllers/category.controller");
const authController = require("./controllers/auth.controller");
const { checkAuth, checkAdminRole } = require("./middlewares/auth.middleware");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ====== CẤU HÌNH SESSION ====== */
app.use(session({
    secret: "secret-key-product-management",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

/* ====== CẤU HÌNH MULTER ====== */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

/* ====== ROUTES AUTHENTICATION ====== */
app.get("/login", authController.showLoginForm);
app.post("/login", authController.login);
app.get("/logout", authController.logout);

/* ====== ROUTES PRODUCTS (require authentication) ====== */
app.get("/", checkAuth, productController.list);
app.get("/add", checkAuth, checkAdminRole, productController.showAddForm);
app.post("/add", checkAuth, checkAdminRole, upload.single("image"), productController.create);
app.get("/edit/:id", checkAuth, checkAdminRole, productController.showEditForm);
app.post("/edit/:id", checkAuth, checkAdminRole, upload.single("image"), productController.update);
app.get("/delete/:id", checkAuth, checkAdminRole, productController.delete);
app.get("/logs/:id", checkAuth, checkAdminRole, productController.getLogs);

/* ====== ROUTES CATEGORIES (require admin) ====== */
app.get("/categories", checkAuth, checkAdminRole, categoryController.list);
app.get("/categories/add", checkAuth, checkAdminRole, categoryController.showAddForm);
app.post("/categories/add", checkAuth, checkAdminRole, categoryController.create);
app.get("/categories/edit/:id", checkAuth, checkAdminRole, categoryController.showEditForm);
app.post("/categories/edit/:id", checkAuth, checkAdminRole, categoryController.update);
app.get("/categories/delete/:id", checkAuth, checkAdminRole, categoryController.delete);

app.listen(3000, () => {
    console.log("✅ Server running: http://localhost:3000");
});