const express = require('express');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/carts.router');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});