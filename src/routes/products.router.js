import express from 'express';
import ProductManager from '../dao/managers/ProductManager.js';
import { buildPagination } from '../utils/pagination.js';

const router = express.Router();
const manager = new ProductManager();

export default (io) => {
    router.get('/', async (req, res) => {
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
            res.json(buildPagination(req, result));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // ... otros endpoints ...

    return router;
};