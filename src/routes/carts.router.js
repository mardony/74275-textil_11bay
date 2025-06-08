import express from 'express';
import CartManager from '../dao/managers/CartManager.js';
import ProductManager from '../dao/managers/ProductManager.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

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
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = parseInt(req.body.quantity) || 1;
        const productId = req.params.pid;

        // Verificar stock
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Actualizar stock
        await productManager.updateProduct(productId, {
            stock: product.stock - quantity
        });

        // Agregar al carrito
        const cart = await cartManager.addProductToCart(
            req.params.cid,
            productId,
            quantity
        );

        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const result = await cartManager.removeProductFromCart(
            req.params.cid,
            req.params.pid
        );

        // Devolver stock al producto
        const product = await productManager.getProductById(result.productId);
        if (product) {
            await productManager.updateProduct(result.productId, {
                stock: product.stock + result.quantity
            });
        }

        res.json(result.cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateCart(
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
        const newQuantity = parseInt(req.body.quantity);
        if (isNaN(newQuantity)) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const result = await cartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            newQuantity
        );

        // Ajustar stock
        const product = await productManager.getProductById(result.productId);
        if (product) {
            const stockDifference = result.oldQuantity - result.newQuantity;
            await productManager.updateProduct(result.productId, {
                stock: product.stock + stockDifference
            });
        }

        res.json(result.cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const result = await cartManager.clearCart(req.params.cid);

        // Devolver todo el stock
        for (const item of result.products) {
            const product = await productManager.getProductById(item.productId);
            if (product) {
                await productManager.updateProduct(item.productId, {
                    stock: product.stock + item.quantity
                });
            }
        }

        res.json(result.cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;