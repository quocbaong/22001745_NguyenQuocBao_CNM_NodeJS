const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
router.get('/', async(req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.render('products', { products: rows });
});

// Add product
router.post('/add', async(req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]
    );
    res.redirect('/');
});

module.exports = router;

//Delete product
router.post('/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM products WHERE id = ?', [id]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Delete failed');
    }
})

// Show edit form
router.get('/edit/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM products WHERE id = ?', [id]
        );

        if (rows.length === 0) {
            return res.status(404).send('Product not found');
        }

        res.render('edit', { product: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Load edit form failed');
    }
});

// Update product
router.post('/edit/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        await db.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]
        );

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Update failed');
    }
});