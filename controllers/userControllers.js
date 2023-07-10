const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');

const imagePath = path.join(__dirname, "..", "assets", "images");

const getImages = async (dir, count = null) => {
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
            msg: 'Welcome to Treasure Mart and thank you for testing my website. To see more sites like this check my <a href="https://github.com/emmy13" target="_blank">github</a>',
            type: 'link',
            url: '/signup',
            text: 'signup',
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
        head: 'Hey🙌',
        msg: "You can easily login anytime you want, though you'll be prompted to do so when you attempt certain functionalities.",
        type: 'link',
        text: 'continue without logging in',
        url: '/all',
        image: 'deal'
    });
    res.render('login');
}

const showSignUpPage = async (req, res) => {
    await req.alert({
        head: 'Welcome🤗',
        msg: "Lets gets to know eachother, we'd would love to see how well we can serve you.<br>You can always sign up later.",
        type: 'link',
        text: 'continue without signing up',
        url: '/all',
        image: 'happy'
    });
    res.render('signup');
}

const showAllPage = async (req, res) => {
    let products = await getImages('products');

    res.render("all", { products });
}

const showProductPage = async (req, res) => {
    const product = {};

    product.url = req.query?.url;
    if(product.url) product.name = product.url.split("/").pop().split(".").shift();

    res.render('product', { product });
}

module.exports = { showHomePage, showLoginPage, showSignUpPage, showAllPage, showProductPage };