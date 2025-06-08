import express from 'express';
import ProductManager from '../dao/managers/ProductManager.js';
import CartManager from '../dao/managers/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query ? { category: query } : {};
        const sortOption = sort ? sort : undefined;

        const result = await productManager.getAllProductsPaginated(filter, {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
            lean: true
        });

        res.render('home', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit,
            query,
            sort
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render('error', { error: 'Producto no encontrado' });
        }
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).render('error', { error: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;