const { Router } = require('express');

const { showHomePage, showLoginPage, showSignUpPage } = require('../controllers/userControllers');

const router = Router();

router.get("/", showHomePage);

router.get("/login", showLoginPage)

router.get("/signup", showSignUpPage)

module.exports = router;