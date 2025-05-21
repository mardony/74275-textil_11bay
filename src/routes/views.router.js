const express = require('express');
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager();
const router = express.Router();

router.get('/home', async (req, res) => {
    const products = await manager.getAllProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
