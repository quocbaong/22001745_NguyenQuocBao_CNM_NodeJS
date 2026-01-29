const categoryRepository = require("../repositories/category.repository");

module.exports = {
    getAllCategories() {
        return categoryRepository.findAll();
    },

    getCategoryById(categoryId) {
        return categoryRepository.findById(categoryId);
    },

    createCategory(categoryData) {
        // Kiểm tra tên danh mục đã tồn tại
        const existing = categoryRepository.findByName(categoryData.name);
        if (existing) {
            throw new Error("Category already exists");
        }
        return categoryRepository.create(categoryData);
    },

    updateCategory(categoryId, categoryData) {
        const category = categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        return categoryRepository.update(categoryId, categoryData);
    },

    deleteCategory(categoryId) {
        const category = categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        // Soft delete: không xoá sản phẩm
        return categoryRepository.delete(categoryId);
    }
};