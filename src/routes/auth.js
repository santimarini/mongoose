const express = require('express');
const AuthController = require('../controllers/auth');
const router = express.Router();

const controller = new AuthController();



router.post('/login', (req, res) => controller.login(req,res));


module.exports = router;
