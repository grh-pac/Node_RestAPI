const express = require('express');
const Product = require('../models/product')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');   
const checAuth = require('../middleware/check-auth');



exports.get_all_products = async(req, res, next)=>{
    try{
        const product = await Product.find().select('name price _id productImage');
        res.status(200).json({
            count: product.length,
            products: product.map(product=>{
                return {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    productImage: product.productImage,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + product._id
                    }
                }
            })
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: 'Internal Server Error',
        });

    }
};

exports.create_product = async (req, res, next)=>{
    try {
        console.log(req.file);
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path,
        });
        const savedProduct = await product.save();

        res.status(201).json({
            message: 'Created Product',
            createdProduct: {
                name: savedProduct.name,
                price: savedProduct.price,
                _id: savedProduct._id,
                productImage: savedProduct.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/products/' + savedProduct._id
                }
            }
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.get_product_by_id =  async(req, res, next)=>{
    const id = req.params.productId;
    try{
        const product = await Product.findById(id).select('name price _id productImage');
        
        
        if(!product){
           
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({
            message: 'Product found',
            product: {
                name: product.name,
                price: product.price,
                _id: product._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:5000/products/'
                }
            }
        
        });
        
        
    }catch(error){
        console.error('Error finding product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
  
 };

exports.update_product = async(req, res, next)=>{
    const id = req.params.productId;
    const updatedOps = {}
    for (const ops of req.body){
        updatedOps[ops.propName] = ops.value;
    }
    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, {$set:updatedOps}, {new: true})
        if(!updatedProduct){
            return res.status(404).json({message: "product not found"})
        }
        res.status(200).json({
            message: "Product Updated successfully",
            request:{
                type: 'PATCH',
                url: 'http://localhost:5000/products/' + updatedProduct._id

            }
        })
    }catch(err){
        console.error("Error Updating product by ID:", error);
        res.status(500).json({error: 'Internal Server Error'});
    }

 };

exports.delete_product = async(req, res, next)=>{
    const id = req.params.productId
    try{
        const deleteProduct = await Product.findByIdAndDelete(id)
        if(!deleteProduct){
            return res.status(404).json({message: 'Product not found'})
        }
        res.status(200).json({
            message: 'Product deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:5000/products/',
                body: {name: 'String', price: 'Number'}
            } 
        })

    }catch(err){
        console.log(`the error occured: ${err.message}`)
        res.status(500).json({ error: 'Internal Server Error' });
    }
   
 };