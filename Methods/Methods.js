const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');

class Methods {
    constructor(params = {}) {
        Object.assign(this, params);
    }

    static async getImages(dir, count = null) {
        const imagePath = path.join(__dirname, "..", "assets", "images");

        if (!dir) return [];

        const imageDir = path.join(imagePath, dir);

        try {
            //const files = fs.readdirSync(),
            //this method works of you dont import promises directly with fs
            //async/await isnt needed if used
            const files = await fs.readdir(imageDir);
            const images = [];

            for (const file of files) {
                const filePath = path.join(imageDir, file);
                const mimeType = mime.lookup(filePath);

                if (mimeType && mimeType.startsWith('image/')) images.push(file);

                if (images.length === count) break
            }

            return images
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

module.exports = Methods;