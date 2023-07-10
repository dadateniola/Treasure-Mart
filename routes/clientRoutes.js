const { Router } = require('express');

const { showHomePage, showLoginPage, showSignUpPage, showAllPage, showProductPage } = require('../controllers/userControllers');

const router = Router();

router.get("/", showHomePage);

router.get("/login", showLoginPage)

router.get("/signup", showSignUpPage)

router.get('/all', showAllPage)

router.get('/product', showProductPage)

module.exports = router;