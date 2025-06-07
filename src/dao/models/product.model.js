import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
    thumbnails: [String],
    code: { type: String, unique: true, required: true },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);