import express from 'express';
import ProductManager from '../dao/managers/ProductManager.js';
import { buildPagination } from '../utils/pagination.js';
import { uploadProductImages, processProductImages } from '../middlewares/imageUpload.js';

const router = express.Router();
const manager = new ProductManager();

export default (io) => {
    router.get('/', async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const filter = query ? { category: query } : {};
            const sortOption = sort ? sort : undefined;

            const result = await manager.getAllProductsPaginated(filter, {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sortOption,
                lean: true
            });

            res.json(buildPagination(req, result));
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await manager.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/',
        uploadProductImages,
        processProductImages,
        async (req, res) => {
            try {
                const product = await manager.addProduct(req.body);
                const updated = await manager.getAllProducts();
                io.emit('updateProducts', updated);
                res.status(201).json(product);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    );

    router.put('/:id',
        uploadProductImages,
        processProductImages,
        async (req, res) => {
            try {
                const updatedProduct = await manager.updateProduct(req.params.id, req.body);
                if (!updatedProduct) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }
                const updated = await manager.getAllProducts();
                io.emit('updateProducts', updated);
                res.json(updatedProduct);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    );

    router.delete('/:id', async (req, res) => {
        try {
            const deletedProduct = await manager.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            const updated = await manager.getAllProducts();
            io.emit('updateProducts', updated);
            res.json({ status: 'success', message: 'Producto eliminado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    return router;
};