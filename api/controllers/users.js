const express = require('express');
require('dotenv').config();
const router  = express.Router();
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')
const User= require('../models/user')
const bcrypt = require('bcrypt');



exports.signup = async (req, res, next) => {
    try {
       const existingUser = await User.findOne({email: req.body.email});
       if(existingUser){
            return res.status(409).json({message: 'Email Exist Already'})
       }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user with hashed password
        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                email: user.email,
                _id: user._id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.login =  async (req, res, next)=>{
    try{
      const findUser = await User.findOne({email: req.body.email});
      if(!findUser){
          return res.status(401).json({
              message: 'Auth Failed'
          })
      }
      const compareUser =await  bcrypt.compare(req.body.password, findUser.password)
      if (!compareUser){
          return res.status(401).json({ message: 'Auth Failed'});
      }
      const token  = jwt.sign(
          {email :findUser.email, userId: findUser._id},
          process.env.JWT_SECRET_KEY,
          {expiresIn: '1h'}
          
      );
  
      res.status(200).json({ message: 'Auth Succeeded', token: token})
         
    }catch(err){
      console.log(err)
    }
};

exports.delete = async(req, res, next)=>{
    const id = req.params.userId;
    try{
        const deleteUser = await User.findByIdAndDelete(id)
        if(!deleteUser){
            res.status(404).json({ message: "User With This Id Not Found"})
        }
        res.status(200).json({
            message: 'User deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:5000/user/',
                body: {email: 'String', password: 'String'}
            } 
        })

    }catch(err){
        console.log(err)
    }
    
};

