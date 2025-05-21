const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/carts.json');

class CartManager {
    async getAllCarts() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = {
            id: this.generateId(carts),
            products: []
        };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(cartId) {
        const carts = await this.getAllCarts();
        return carts.find(c => c.id === cartId);
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.getAllCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product === productId);
        if (product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts(carts);
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product !== productId);
        await this.saveCarts(carts);
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const carts = await this.getAllCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product === productId);
        if (!product) throw new Error('Producto no encontrado en el carrito');

        product.quantity = quantity;
        await this.saveCarts(carts);
        return cart;
    }

    async clearCart(cartId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await this.saveCarts(carts);
        return cart;
    }

    generateId(carts) {
        return carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    }
}

module.exports = CartManager;
