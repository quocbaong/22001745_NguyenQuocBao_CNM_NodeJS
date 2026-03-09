let products = []

class Product {
    static async create(productData) {
        const product = {
            id: Date.now(),
            ...productData
        }
        products.push(product)
        return product
    }

    static async findAll() {
        return products
    }

    static async findById(id) {
        return products.find(p => p.id == id)
    }
}

module.exports = Product