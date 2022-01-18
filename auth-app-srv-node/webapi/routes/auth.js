const express = require('express');
const authController = require("../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.post('/refresh-token', authController.getNewAccessToken);
router.post('/local-login', authController.loginLocal);
router.get('/start_google_auth', authController.startGoogleAuth);
router.get('/google-login', authController.loginGoogle);

module.exports = router;
