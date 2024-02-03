const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')


exports.order_create =  async(req, res, next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.body.productId)) {
            return res.status(400).json({
                message: 'Invalid productId. Please provide a valid ObjectId.'
            });
        }
        const productId = await Product.findById(req.body.productId);
        if(!productId){
            return res.status(404).json({message : 'Product with a specific id not found'})
        }

        const order = new Order({
            quantity: req.body.quantity,
            product: productId
        })
        await order.save()
        res.status(201).json({
            message: 'Order was Created successfully',
            order: {
                quantity: order.quantity,
                product: order.product,
                _id: order._id,
               request:{
                type: 'GET',
                url: 'http://localhost:5000/order/' + order._id
               }
            }
        })
    }catch(err){
        console.log(err.message)
    }   
};

exports.order_get_all = async(req, res, next)=>{
    try{
        const order = await Order.find().select('product quantity _id').populate('product', 'name');
        res.status(200).json({
            count: order.length,
            order: order.map(order =>{
                return { 
                    product: order.product,
                     quantity: order.quantity,
                     _id: order._id,
                     request :{
                         type: 'GET',
                         url: 'http://localhost:5000/orders/' + order._id
 
                     }
                 }

            }) 
        })

    }catch(err){
        console.log(err)
    }
};

exports.get_order_by_id = async (req, res, next)=>{
    const id = req.params.orderId
    try{
        const order = await Order.findById(id).populate('product', 'name');
        if(!order){
            return res.status(404).json({ message: "Order Not Found" });
        }
        res.status(200).json({
            message: 'Order Found',
            order: {
                quantity: order.quantity,
                product: order.product,
                _id: order._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:5000/orders/'
                }

            }
        });

    }catch(err){
        console.log(err);
    }   
};

exports.delete_order = async (req, res, next)=>{
    const id = req.params.orderId
    try{
        const deleteOrder = await Order.findByIdAndDelete(id)
        if(!deleteOrder){
            res.status(404).json({ message: 'Order Not Found'});
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            url: 'http://localhost:5000/orders',
            body: {quantity: 'Number', product : 'id'}
        })

    }catch(err){
        console.log(err)
    }

};