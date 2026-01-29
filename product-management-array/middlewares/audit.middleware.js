const { v4: uuidv4 } = require("uuid");
const productLogs = require("../data/productLog.data");

module.exports = {
    logProductAction(productId, action, userId) {
        const log = {
            logId: uuidv4(),
            productId,
            action, // CREATE, UPDATE, DELETE
            userId: userId || "anonymous",
            time: new Date().toISOString()
        };
        productLogs.push(log);
        console.log(`📝 [LOG] ${action} - Product: ${productId}, User: ${userId}`);
    },

    getProductLogs(productId) {
        if (productId) {
            return productLogs.filter(log => log.productId === productId);
        }
        return productLogs;
    }
};