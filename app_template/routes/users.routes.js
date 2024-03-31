const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller')

router.route('/').post(userController.getUsers);


module.exports = router;