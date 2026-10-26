const path = require('path');
const multer = require('multer');
const { Jimp } = require('jimp');
const { v4: uuidv4 } = require('uuid');
const uploadPath = path.join(__dirname, '../public/uploads');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        next(
            isPhoto ? null : new Error('Invalid file type'),
            isPhoto
        );
    }
};

const uploadPhoto = multer(multerOptions).single('photo');

async function resizeAndSaveImage(req) {
    if (!req.file) {
        return null;
    }
    const extension = req.file.mimetype.split('/')[1];
    const filename = `${uuidv4()}.${extension}`;
    const image = await Jimp.read(req.file.buffer);
    image.resize({ w: 800, h: Jimp.AUTO });
    await image.write(
        path.join(uploadPath, filename)
    );
    
    return filename;
}
module.exports = { uploadPhoto, resizeAndSaveImage};