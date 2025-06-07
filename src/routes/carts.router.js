import express from 'express';
import CartManager from '../dao/managers/CartManager.js';

const router = express.Router();
const manager = new CartManager();

router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = parseInt(req.body.quantity) || 1;
        const cart = await manager.addProductToCart(
            req.params.cid,
            req.params.pid,
            quantity
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.removeProductFromCart(
            req.params.cid,
            req.params.pid
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await manager.updateCart(
            req.params.cid,
            req.body.products
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await manager.clearCart(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;