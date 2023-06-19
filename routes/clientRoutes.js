const { Router } = require('express');

const { showHomePage } = require('../controllers/userControllers');

const router = Router();

router.get("/", showHomePage)

module.exports = router;