const repository = require("../repositories/product.repository");
const auditMiddleware = require("../middlewares/audit.middleware");

module.exports = {
    getAllProducts() {
        return repository.findAll();
    },

    getProductById(id) {
        return repository.findById(id);
    },

    // Tìm kiếm theo tên
    searchByName(name) {
        return repository.findByName(name);
    },

    // Lọc theo category
    filterByCategory(categoryId) {
        return repository.findByCategory(categoryId);
    },

    // Lọc theo khoảng giá
    filterByPrice(minPrice, maxPrice) {
        return repository.findByPriceRange(minPrice, maxPrice);
    },

    // Tìm kiếm & lọc kết hợp
    searchAndFilter(filters) {
        let results = repository.findAll();

        // Tìm theo tên
        if (filters.name) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        // Lọc theo category
        if (filters.categoryId) {
            results = results.filter(p => p.categoryId === filters.categoryId);
        }

        // Lọc theo khoảng giá
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            results = results.filter(p =>
                p.price >= filters.minPrice && p.price <= filters.maxPrice
            );
        }

        return results;
    },

    // Phân trang
    paginate(items, page, limit = 10) {
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = items.slice(startIndex, endIndex);

        return {
            items: paginatedItems,
            currentPage: page,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    },

    // Kiểm tra trạng thái tồn kho
    getInventoryStatus(product) {
        if (product.quantity === 0) {
            return { status: "Hết hàng", color: "danger" };
        } else if (product.quantity < 5) {
            return { status: "Sắp hết", color: "warning" };
        } else {
            return { status: "Còn hàng", color: "success" };
        }
    },

    addProduct(data, file, userId) {
        const imageName = file ? file.filename : null;
        const product = repository.create(data, imageName);

        // Ghi log
        auditMiddleware.logProductAction(product.id, "CREATE", userId);
        return product;
    },

    updateProduct(id, data, file, userId) {
        const imageName = file ? file.filename : null;
        const product = repository.update(id, data, imageName);

        // Ghi log
        auditMiddleware.logProductAction(id, "UPDATE", userId);
        return product;
    },

    deleteProduct(id, userId) {
        const success = repository.delete(id);

        // Ghi log
        if (success) {
            auditMiddleware.logProductAction(id, "DELETE", userId);
        }
        return success;
    },

    // Lấy lịch sử thao tác
    getProductLogs(productId) {
        return auditMiddleware.getProductLogs(productId);
    }
};