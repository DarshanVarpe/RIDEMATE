const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { validate } = require('../middlewares/validate.middlewares.js');
const { complaintSchema } = require('../schemas/complaintSchema.js');
const { restrictToUserlogin } = require('../middlewares/auth.middleware.js');

router.get('/', restrictToUserlogin, (req, res) => {
    res.render('help.ejs');
});

router.post('/', restrictToUserlogin, validate(complaintSchema), complaintController.registerComplaint);

module.exports = router;