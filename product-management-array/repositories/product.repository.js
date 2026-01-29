const products = require("../data/product.data");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    // Lấy tất cả sản phẩm không bị soft delete
    findAll() {
        return products.filter(p => !p.isDeleted);
    },

    findById(id) {
        return products.find(p => p.id === id && !p.isDeleted);
    },

    // Tìm kiếm theo tên (contains)
    findByName(name) {
        return products.filter(p =>
            !p.isDeleted && p.name.toLowerCase().includes(name.toLowerCase())
        );
    },

    // Lọc theo category
    findByCategory(categoryId) {
        return products.filter(p =>
            !p.isDeleted && p.categoryId === categoryId
        );
    },

    // Lọc theo khoảng giá
    findByPriceRange(minPrice, maxPrice) {
        return products.filter(p =>
            !p.isDeleted && p.price >= minPrice && p.price <= maxPrice
        );
    },

    create(data, image) {
        const product = {
            id: uuidv4(),
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            categoryId: data.categoryId || null,
            url_image: image || null,
            isDeleted: false,
            createdAt: new Date().toISOString()
        };
        products.push(product);
        return product;
    },

    update(id, data, image) {
        const product = this.findById(id);
        if (product) {
            product.name = data.name;
            product.price = Number(data.price);
            product.quantity = Number(data.quantity);
            product.categoryId = data.categoryId || product.categoryId;
            if (image) {
                product.url_image = image;
            }
        }
        return product;
    },

    // Soft delete: đánh dấu isDeleted = true
    delete(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            product.isDeleted = true;
            return true;
        }
        return false;
    }
};