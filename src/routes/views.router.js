import express from 'express';
import ProductManager from '../dao/managers/ProductManager.js';

const router = express.Router();
const manager = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };

        const filter = query ? { category: query } : {};

        const result = await manager.getAllProductsPaginated(filter, options);

        res.render('home', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            query,
            sort
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await manager.getProductById(req.params.pid);
        res.render('productDetail', { product });
    } catch (error) {
        res.status(404).render('error', { error: 'Producto no encontrado' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        res.status(404).render('error', { error: 'Carrito no encontrado' });
    }
});

// ... otras rutas de vistas ...

export default router;