const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const imagePath = path.join(__dirname, "..", "assets", "images")

const showHomePage = (req, res) => {
    const newestPath = path.join(imagePath, "newest");

    fs.readdir(newestPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }

        const newestImages = [];

        files.forEach((file) => {
            const filePath = newestPath + '/' + file;
            const mimeType = mime.lookup(filePath);

            if (mimeType && mimeType.startsWith('image/')) {
                newestImages.push(file);
            }
        });

        res.render('home', { newestImages });
    })
}

module.exports = { showHomePage };