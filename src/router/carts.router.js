const express = require('express');
const CartManager = require('../CartManager');

const router = express.Router();
const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        await cartManager.addProductToCart(cartId, productId);
        res.json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;