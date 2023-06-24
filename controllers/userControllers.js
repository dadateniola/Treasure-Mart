const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');

const imagePath = path.join(__dirname, "..", "assets", "images");

const getImages = async (dir, count) => {
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
};

const showHomePage = async (req, res) => {
    try {
        await req.alert({
            head: 'Hello !!',
            msg: 'Welcome to treasure mart and thank you for testing my website. To see more sites like this check my <a href="https://github.com/emmy13" target="_blank">github</a>',
            type: 'btn',
            txt: 'Help find a product',
        });

        let newestImages = await getImages('newest', 5);

        res.render('home', { newestImages });
    } catch (err) {
        console.log(err);
        res.render('home', { newestImages: [] })
    }
}

module.exports = { showHomePage };