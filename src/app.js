import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { configureSocket } from './utils/socketUtils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import loadInitialData from './initializeDB.js';
import { multiply, cartTotal, firstImage, eq } from './utils/handlebarsHelpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Configuración de MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars con helpers
const hbs = handlebars.create({
    helpers: { multiply, cartTotal, firstImage, eq }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Crear servidor HTTP
const httpServer = app.listen(8080, async () => {
    console.log('Servidor corriendo en http://localhost:8080');
    await loadInitialData();

    // Crear carrito si no existe
    const Cart = (await import('./dao/models/cart.model.js')).default;
    const fixedCartId = '65d4a5e1f7a1b2c3d4e5f6a7';
    let cart = await Cart.findById(fixedCartId);
    if (!cart) {
        cart = new Cart({ _id: fixedCartId, products: [] });
        await cart.save();
        console.log('Carrito fijo creado');
    }
});

// Inicializar Socket.io
const io = new Server(httpServer);
configureSocket(io);

// Pasar io a las rutas que lo necesiten
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routers
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Error interno del servidor' });
});