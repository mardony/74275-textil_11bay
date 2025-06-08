import Product from '../models/product.model.js';
import cloudinary from '../../config/cloudinary.js';

class ProductManager {
    async getAllProducts() {
        return await Product.find().lean();
    }

    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    async addProduct(productData) {
        const existingProduct = await Product.findOne({ code: productData.code });
        if (existingProduct) {
            throw new Error('Producto con ese código ya existe');
        }

        const newProduct = new Product({
            ...productData,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            thumbnails: productData.thumbnails || []
        });

        return await newProduct.save();
    }

    async updateProduct(id, updatedFields) {
        if (updatedFields.thumbnails) {
            const oldProduct = await Product.findById(id);
            if (oldProduct && oldProduct.thumbnails.length > 0) {
                await this.deleteOldImages(oldProduct.thumbnails);
            }
        }

        return await Product.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true
        });
    }

    async deleteProduct(id) {
        const product = await Product.findById(id);
        if (!product) return null;

        if (product.thumbnails.length > 0) {
            await this.deleteOldImages(product.thumbnails);
        }

        return await Product.findByIdAndDelete(id);
    }

    async getAllProductsPaginated(filter = {}, options = {}) {
        const defaultOptions = {
            page: options.page || 1,
            limit: options.limit || 10,
            lean: true
        };

        if (options.sort) {
            defaultOptions.sort = { price: options.sort === 'asc' ? 1 : -1 };
        }

        return await Product.paginate(filter, defaultOptions);
    }

    async deleteOldImages(thumbnails) {
        try {
            const deletePromises = thumbnails.map(thumb =>
                cloudinary.uploader.destroy(thumb.public_id)
            );
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting old images:', error);
        }
    }
}

export default ProductManager;