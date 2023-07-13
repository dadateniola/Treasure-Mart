const Methods = require('../Methods/Methods');

//Route handlers
const showHomePage = async (req, res) => {
    await req.alert({
        head: 'Hello !!',
        msg: 'Welcome to Treasure Mart and thank you for testing my website. To see more sites like this check my <a href="https://github.com/emmy13" target="_blank">github</a>',
        type: 'link',
        url: '/signup',
        text: 'signup',
        image: 'happy'
    });

    let newestImages = await Methods.getImages('newest', 5);
    let popular = await Methods.getImages('popular', 3);
    let deals = await Methods.getImages('deals', 3);
    let collections = await Methods.getImages('collections', 4);

    res.render('home', { newestImages, popular, deals, collections });
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
    let products = await Methods.getImages('products');

    res.render("all", { products });
}

const showProductPage = async (req, res) => {
    const product = {};

    product.url = req.query?.url;
    if (product.url) product.name = product.url.split("/").pop().split(".").shift().split('-').join(' ');

    res.render('product', { product });
}

module.exports = { showHomePage, showLoginPage, showSignUpPage, showAllPage, showProductPage };