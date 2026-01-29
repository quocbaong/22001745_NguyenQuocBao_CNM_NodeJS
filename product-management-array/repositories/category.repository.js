const categories = require("../data/category.data");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    findById(categoryId) {
        return categories.find(c => c.categoryId === categoryId && !c.isDeleted) || null;
    },

    findAll() {
        return categories.filter(c => !c.isDeleted);
    },

    findByName(name) {
        return categories.find(c => c.name === name && !c.isDeleted) || null;
    },

    create(categoryData) {
        const newCategory = {
            categoryId: uuidv4(),
            name: categoryData.name,
            description: categoryData.description || "",
            createdAt: new Date().toISOString(),
            isDeleted: false
        };
        categories.push(newCategory);
        return newCategory;
    },

    update(categoryId, categoryData) {
        const category = this.findById(categoryId);
        if (category) {
            if (categoryData.name) category.name = categoryData.name;
            if (categoryData.description) category.description = categoryData.description;
        }
        return category;
    },

    delete(categoryId) {
        // Soft delete: đánh dấu isDeleted = true
        const category = categories.find(c => c.categoryId === categoryId);
        if (category) {
            category.isDeleted = true;
            return true;
        }
        return false;
    }
};