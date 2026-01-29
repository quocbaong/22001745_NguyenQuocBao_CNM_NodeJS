const categoryService = require("../services/category.service");

exports.list = (req, res) => {
    const categories = categoryService.getAllCategories();
    res.render("categories/list", { categories });
};

exports.showAddForm = (req, res) => {
    res.render("categories/add");
};

exports.create = (req, res) => {
    try {
        categoryService.createCategory(req.body);
        res.redirect("/categories");
    } catch (error) {
        res.render("categories/add", { error: error.message });
    }
};

exports.showEditForm = (req, res) => {
    const category = categoryService.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).render("error", { message: "❌ Danh mục không tồn tại" });
    }
    res.render("categories/edit", { category });
};

exports.update = (req, res) => {
    try {
        categoryService.updateCategory(req.params.id, req.body);
        res.redirect("/categories");
    } catch (error) {
        const category = categoryService.getCategoryById(req.params.id);
        res.render("categories/edit", { category, error: error.message });
    }
};

exports.delete = (req, res) => {
    try {
        categoryService.deleteCategory(req.params.id);
        res.redirect("/categories");
    } catch (error) {
        res.status(404).render("error", { message: error.message });
    }
};