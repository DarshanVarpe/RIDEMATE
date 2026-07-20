const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { upload } = require('../utils/multer.utils.js');
const { restrictToUserlogin, restrictToLoginedUser, restrictToCorrectResetLink } = require('../middlewares/auth.middleware.js');
const passport = require("../config/googleAuth.services.js");
const { validate } = require('../middlewares/validate.middlewares.js');
const { loginSchema, forgetPasswordSchema, resetPasswordSchema } = require('../schemas/userSchema.js');

router.get('/', restrictToLoginedUser, (req, res) => {
    res.render('index.ejs');
});

router.get('/login', restrictToLoginedUser, (req, res) => {
    res.render('login.ejs');
});

router.get("/auth/google", restrictToLoginedUser, (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect("/login?error=" + encodeURIComponent("Google OAuth is not configured locally."));
    }
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account", session: false })(req, res, next);
});
router.get("/auth/google/callback", restrictToLoginedUser, userController.googleAuthCallback);

router.get(['/register', '/signup'], restrictToLoginedUser, (req, res) => {
    res.render('register.ejs', {
        error: null
    });
});

router.get('/forget-password', restrictToLoginedUser, (req, res) => {
    res.render('forget-password.ejs');
});

router.get("/reset-password/:token", restrictToCorrectResetLink, (req, res) => {
    const { token } = req.params;
    res.render("reset-password", { token, email: req.user.email });
});
router.get('/home', restrictToUserlogin, (req, res) => {
    res.render('home.ejs');
});
router.get('/about', restrictToUserlogin, (req, res) => {
    res.render('about.ejs');
});
router.get('/find_Ride', restrictToUserlogin, (req, res) => {
    res.render('findRide.ejs');
});
router.get('/offer_Ride', restrictToUserlogin, (req, res) => {
    res.render('createRide.ejs');
});
router.get('/inbox', restrictToUserlogin, (req, res) => {
    res.render('inbox.ejs');
});

router.get('/profile', restrictToUserlogin, (req, res) => {
    res.render('profile.ejs');
});

router.get('/logout', userController.logout);

router.post('/register', upload.single('img'), userController.registerUser);

router.post('/login', validate(loginSchema), userController.loginUser);

router.post('/homePage', restrictToUserlogin, userController.homePageDetails);

router.post('/inbox', restrictToUserlogin, userController.sendAllMessages);

router.post('/forget-password', validate(forgetPasswordSchema),userController.forgetPassword);

router.post('/profile', restrictToUserlogin, userController.showProfile);

router.post('/getUserRideStats', restrictToUserlogin, userController.getUserRideStats);

router.post('/resetPassword', validate(resetPasswordSchema), userController.resetPassword);

module.exports = router;