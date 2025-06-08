import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'textil_11bay/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export const uploadProductImages = upload.array('images', 5); // Máximo 5 imágenes

export const processProductImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            req.body.thumbnails = [];
            return next();
        }

        req.body.thumbnails = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        next();
    } catch (error) {
        next(error);
    }
};