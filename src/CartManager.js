const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: this.generateId(carts),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error("Cart not found");
        }

        const cart = carts[cartIndex];
        const existingProduct = cart.products.find(item => item.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading file:", error);
            return [];
        }
    }

    generateId(carts) {
        return carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
    }
}

module.exports = CartManager;