const service = require("../services/product.service");

exports.list = (req, res) => {
    const products = service.getAllProducts();
    res.render("products/list", { products });
};

exports.showAddForm = (req, res) => {
    res.render("products/add");
};

exports.create = (req, res) => {
    service.addProduct(req.body, req.file);
    res.redirect("/");
};

exports.showEditForm = (req, res) => {
    const product = service.getProductById(req.params.id);
    res.render("products/edit", { product });
};

exports.update = (req, res) => {
    service.updateProduct(req.params.id, req.body, req.file);
    res.redirect("/");
};

exports.delete = (req, res) => {
    service.deleteProduct(req.params.id);
    res.redirect("/");
};