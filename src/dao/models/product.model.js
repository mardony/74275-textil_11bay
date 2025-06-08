import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
    thumbnails: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],
    code: { type: String, unique: true, required: true },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema);