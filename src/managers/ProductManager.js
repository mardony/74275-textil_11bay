const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    async getAllProducts() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getAllProducts();

        // Validación: verificar si nombre ya existe
        if (products.some(p => p.name === product.name)) {
            throw new Error('Producto con ese nombre ya existe');
        }

        if (!product.name || !product.price || !product.description) {
            throw new Error('Datos incompletos');
        }

        product.id = this.generateId(products);
        product.status = true;
        products.push(product);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return false;

        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return true;
    }

    async deleteProduct(id) {
        let products = await this.getAllProducts();
        products = products.filter(p => p.id !== id);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return true;
    }

    generateId(products) {
        return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }
}

module.exports = ProductManager;
