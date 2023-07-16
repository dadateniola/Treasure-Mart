const { Router } = require('express');

const { showHomePage, showLoginPage, showSignUpPage, showAllPage, showProductPage, showAccountPage, show404 } = require('../controllers/userControllers');
const Methods = require('../Methods/Methods');

const router = Router();
const cart = [];

router.use(async (req, res, next) => {
    const cartItems = await Methods.getImages('newest', 2);
    cart.splice(0, cart.length, ...cartItems);
    res.locals.cart = cart;
    next();
})

//Routes

//FIX NAVBAR ERROR

router.get("/", showHomePage);

router.get("/login", showLoginPage)

router.get("/signup", showSignUpPage)

router.get('/all', showAllPage)

router.get('/product', showProductPage)

router.get('/account', showAccountPage)

router.get('/404', show404)

module.exports = router;