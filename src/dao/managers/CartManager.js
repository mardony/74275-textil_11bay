import Cart from '../models/cart.model.js';

class CartManager {
    async createCart() {
        const newCart = new Cart({ products: [] });
        return await newCart.save();
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId)
            .populate({
                path: 'products.product',
                model: 'Product',
                select: 'name price description category thumbnails code stock'
            })
            .lean();

        if (!cart) throw new Error('Carrito no encontrado');

        // Asegurar que cada producto tenga la información necesaria
        cart.products = cart.products.map(item => ({
            ...item,
            product: item.product || { name: "Producto eliminado" }
        }));

        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const existingProduct = cart.products.find(
            p => p.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        // Encontrar el producto para devolver el stock
        const productToRemove = cart.products.find(
            p => p.product.toString() === productId
        );

        if (!productToRemove) throw new Error('Producto no encontrado en el carrito');

        cart.products = cart.products.filter(
            p => p.product.toString() !== productId
        );

        return {
            cart: await cart.save(),
            productId,
            quantity: productToRemove.quantity
        };
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(
            p => p.product.toString() === productId
        );
        if (!product) throw new Error('Producto no encontrado en el carrito');

        const oldQuantity = product.quantity;
        product.quantity = quantity;

        return {
            cart: await cart.save(),
            productId,
            oldQuantity,
            newQuantity: quantity
        };
    }

    async updateCart(cartId, products) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = products;
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productsToRestore = cart.products.map(item => ({
            productId: item.product.toString(),
            quantity: item.quantity
        }));

        cart.products = [];

        return {
            cart: await cart.save(),
            products: productsToRestore
        };
    }
}

export default CartManager;