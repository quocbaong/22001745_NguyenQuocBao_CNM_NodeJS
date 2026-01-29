const products = require("../data/product.data");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    findAll() {
        return products;
    },

    findById(id) {
        return products.find(p => p.id === id);
    },

    create(data, image) {
        const product = {
            id: uuidv4(),
            name: data.name,
            price: Number(data.price),
            quantity: Number(data.quantity),
            image: image || null
        };
        products.push(product);
    },

    update(id, data, image) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: data.name,
                price: Number(data.price),
                quantity: Number(data.quantity),
                image: image ? image : products[index].image
            };
        }
    },

    delete(id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
        }
    }
};