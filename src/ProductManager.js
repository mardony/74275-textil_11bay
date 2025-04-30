const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading file:", error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        product.id = this.generateId(products);
        product.status = true;
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getAllProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return false;
        }
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return true;
    }

    async deleteProduct(id) {
        let products = await this.getAllProducts();
        products = products.filter(product => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    generateId(products) {
        return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }
}

module.exports = ProductManager;