import mongoose from 'mongoose';
import Product from './dao/models/product.model.js';
import Cart from './dao/models/cart.model.js';
import fs from 'fs/promises';

const loadInitialData = async () => {
    try {
        // Cargar productos solo si no existen
        const productsCount = await Product.countDocuments();
        if (productsCount === 0) {
            const productsData = JSON.parse(await fs.readFile('./src/data/products.json', 'utf-8'));
            await Product.insertMany(productsData);
            console.log('Datos iniciales de productos cargados');
        }

        // Crear carrito fijo si no existe
        const fixedCartId = new mongoose.Types.ObjectId('65d4a5e1f7a1b2c3d4e5f6a7');
        let fixedCart = await Cart.findById(fixedCartId);

        if (!fixedCart) {
            fixedCart = new Cart({
                _id: fixedCartId,
                products: []
            });
            await fixedCart.save();
            console.log('Carrito fijo creado con ID 65d4a5e1f7a1b2c3d4e5f6a7');
        }
    } catch (error) {
        console.error('Error cargando datos iniciales:', error);
    }
};

export default loadInitialData;
