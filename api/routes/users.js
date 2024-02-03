const express = require('express');
require('dotenv').config();
const router  = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')
const User= require('../models/user')
const bcrypt = require('bcrypt');
const UserController = require('../controllers/users')



router.post('/signup',UserController.signup );
router.delete('/:userId', UserController.delete);

router.post('/login',UserController.login);


module.exports = router;