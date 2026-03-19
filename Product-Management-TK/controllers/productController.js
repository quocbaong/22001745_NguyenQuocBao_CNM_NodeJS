const Product = require('../models/productModel');
const { v4: uuidv4 } = require('uuid');
const { s3 } = require('../config/aws');
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

module.exports = {

    index: async(req, res) => {
        let products = await Product.getAll();
        const search = req.query.search;
        if (search) {
            products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        res.render('index', { products, search, success: req.query.success, error: req.query.error });
    },

    showAdd: (req, res) => {
        res.render('add');
    },

    create: async(req, res) => {
        try {
            const product = {
                id: uuidv4(),
                name: req.body.name,
                price: parseFloat(req.body.price),
                unit_in_stock: parseInt(req.body.unit_in_stock),
                url_image: req.file.location
            };

            // Basic validation
            if (!product.name || product.price <= 0 || product.unit_in_stock < 0) {
                return res.redirect('/add?error=Invalid input data');
            }

            await Product.create(product);
            res.redirect('/?success=Product created successfully');
        } catch (error) {
            console.error(error);
            res.redirect('/add?error=Failed to create product');
        }
    },

    showEdit: async(req, res) => {
        const product = await Product.getById(req.params.id);
        res.render('edit', { product });
    },

    update: async(req, res) => {
        try {
            const id = req.params.id;

            // Delete old image if a new one is uploaded
            if (req.file && req.body.old_image && req.body.old_image !== req.file.location) {
                try {
                    const url = new URL(req.body.old_image);
                    const key = url.pathname.substring(1);
                    await s3.send(new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key
                    }));
                } catch (error) {
                    console.error('Error deleting old image from S3:', error);
                }
            }

            const product = {
                name: req.body.name,
                price: parseFloat(req.body.price),
                unit_in_stock: parseInt(req.body.unit_in_stock),
                url_image: req.file ? req.file.location : req.body.old_image
            };

            // Basic validation
            if (!product.name || product.price <= 0 || product.unit_in_stock < 0) {
                return res.redirect(`/edit/${id}?error=Invalid input data`);
            }

            await Product.update(id, product);
            res.redirect('/?success=Product updated successfully');
        } catch (error) {
            console.error(error);
            res.redirect(`/edit/${req.params.id}?error=Failed to update product`);
        }
    },

    delete: async(req, res) => {
        try {
            const product = await Product.getById(req.params.id);
            if (product && product.url_image) {
                try {
                    const url = new URL(product.url_image);
                    const key = url.pathname.substring(1); // Remove leading '/'
                    await s3.send(new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key
                    }));
                } catch (error) {
                    console.error('Error deleting image from S3:', error);
                    // Continue with DB deletion even if S3 fails
                }
            }
            await Product.delete(req.params.id);
            res.redirect('/?success=Product deleted successfully');
        } catch (error) {
            console.error(error);
            res.redirect('/?error=Failed to delete product');
        }
    },

    detail: async(req, res) => {
        const product = await Product.getById(req.params.id);
        res.render('detail', { product });
    }
};