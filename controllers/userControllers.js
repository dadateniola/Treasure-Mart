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
            msg: 'Welcome to Treasure Mart and thank you for testing my website. To see more sites like this check my <a href="https://github.com/emmy13" target="_blank">github</a>\n',
            type: 'btn',
            text: ['login', 'signup'],
            image: 'happy'
        });

        let newestImages = await getImages('newest', 5);

        res.render('home', { newestImages });
    } catch (err) {
        console.log(err);
        res.render('home', { newestImages: [] })
    }
}

const showLoginPage = async (req, res) => {
    await req.alert({
        head: 'Hi🙌',
        msg: 'Lets gets to know eachother, we would love to see how far we can serve you.\n',
        type: 'none',
        image: 'happy'
    });
    res.render('login');
}

const showSignUpPage = (req, res) => {
    res.render('signup');
}

module.exports = { showHomePage, showLoginPage, showSignUpPage };