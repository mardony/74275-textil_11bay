const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

const app = express();
const httpServer = require('http').createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use(express.static(path.join(__dirname, 'public')));

// Config Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Socket.io para productos en tiempo real
io.on('connection', async socket => {
    const products = await productManager.getAllProducts();
    socket.emit('updateProducts', products);

    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
        const updated = await productManager.getAllProducts();
        io.emit('updateProducts', updated);
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        const updated = await productManager.getAllProducts();
        io.emit('updateProducts', updated);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
