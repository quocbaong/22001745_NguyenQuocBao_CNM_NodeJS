const service = require("../services/product.service");
const categoryService = require("../services/category.service");

exports.list = (req, res) => {
    let products = service.getAllProducts();
    const categories = categoryService.getAllCategories();

    // Tìm kiếm & lọc
    const filters = {
        name: req.query.name || "",
        categoryId: req.query.categoryId || "",
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
    };

    if (filters.name || filters.categoryId || filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        products = service.searchAndFilter(filters);
    }

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const pagination = service.paginate(products, page, limit);

    // Thêm trạng thái tồn kho
    const productsWithStatus = pagination.items.map(product => ({
        ...product,
        inventory: service.getInventoryStatus(product)
    }));

    res.render("products/list", {
        products: productsWithStatus,
        categories,
        filters,
        pagination,
        user: req.session.user || null
    });
};

exports.showAddForm = (req, res) => {
    const categories = categoryService.getAllCategories();
    res.render("products/add", { categories });
};

exports.create = (req, res) => {
    const imageName = req.file ? req.file.filename : null;
    service.addProduct(req.body, req.file, req.session.user.userId);
    res.redirect("/");
};

exports.showEditForm = (req, res) => {
    const product = service.getProductById(req.params.id);
    const categories = categoryService.getAllCategories();
    res.render("products/edit", { product, categories });
};

exports.update = (req, res) => {
    service.updateProduct(req.params.id, req.body, req.file, req.session.user.userId);
    res.redirect("/");
};

exports.delete = (req, res) => {
    service.deleteProduct(req.params.id, req.session.user.userId);
    res.redirect("/");
};

// Xem lịch sử thao tác sản phẩm
exports.getLogs = (req, res) => {
    const product = service.getProductById(req.params.id);
    if (!product) {
        return res.status(404).render("error", { message: "❌ Sản phẩm không tồn tại" });
    }
    const logs = service.getProductLogs(req.params.id);
    res.render("products/logs", { product, logs });
};