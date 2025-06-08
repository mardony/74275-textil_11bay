import ProductManager from '../dao/managers/ProductManager.js';
const productManager = new ProductManager();

export const configureSocket = (io) => {
    io.on('connection', async (socket) => {
        console.log('Cliente conectado');

        try {
            const products = await productManager.getAllProducts();
            socket.emit('updateProducts', products);
        } catch (error) {
            socket.emit('error', 'Error al cargar productos');
        }

        socket.on('addProduct', async (productData) => {
            try {
                await productManager.addProduct(productData);
                const updatedProducts = await productManager.getAllProducts();
                io.emit('updateProducts', updatedProducts);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        socket.on('deleteProduct', async (productId) => {
            try {
                await productManager.deleteProduct(productId);
                const updatedProducts = await productManager.getAllProducts();
                io.emit('updateProducts', updatedProducts);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });
    });
};