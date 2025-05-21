// Agrega un producto con cantidad
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await manager.addProductToCart(
            parseInt(req.params.cid),
            parseInt(req.params.pid),
            parseInt(req.body.quantity || 1)
        );
        res.json(cart);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Elimina un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await manager.removeProductFromCart(
            parseInt(req.params.cid),
            parseInt(req.params.pid)
        );
        res.json(cart);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Actualiza cantidad de un producto
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await manager.updateProductQuantity(
            parseInt(req.params.cid),
            parseInt(req.params.pid),
            parseInt(req.body.quantity)
        );
        res.json(cart);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Vaciar el carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await manager.clearCart(parseInt(req.params.cid));
        res.json(cart);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});
