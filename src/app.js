import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { configureSocket } from './utils/socketUtils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Configuración de MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const httpServer = app.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});

const io = new Server(httpServer);
configureSocket(io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);