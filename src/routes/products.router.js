const express = require('express');
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager();

module.exports = (io) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const products = await manager.getAllProducts();
        res.json(products);
    });

    router.post('/', async (req, res) => {
        try {
            const product = await manager.addProduct(req.body);
            const updated = await manager.getAllProducts();
            io.emit('updateProducts', updated);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        await manager.deleteProduct(parseInt(req.params.id));
        const updated = await manager.getAllProducts();
        io.emit('updateProducts', updated);
        res.json({ status: 'deleted' });
    });

    return router;
};
