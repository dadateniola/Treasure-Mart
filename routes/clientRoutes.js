const { Router } = require('express');

const { showHomePage, showLoginPage, showSignUpPage, showAllPage } = require('../controllers/userControllers');

const router = Router();

router.get("/", showHomePage);

router.get("/login", showLoginPage)

router.get("/signup", showSignUpPage)

router.get('/all', showAllPage)

module.exports = router;