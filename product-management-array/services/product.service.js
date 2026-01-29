const repository = require("../repositories/product.repository");

module.exports = {
    getAllProducts() {
        return repository.findAll();
    },

    getProductById(id) {
        return repository.findById(id);
    },

    addProduct(data, file) {
        const imageName = file ? file.filename : null;
        repository.create(data, imageName);
    },

    updateProduct(id, data, file) {
        const imageName = file ? file.filename : null;
        repository.update(id, data, imageName);
    },

    deleteProduct(id) {
        repository.delete(id);
    }
};