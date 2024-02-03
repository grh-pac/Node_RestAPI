require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes  = require('./api/routes/users');


const uri ='mongodb+srv://grishcom23:grishcom23@cluster0.eismuil.mongodb.net/?retryWrites=true&w=majority';

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Call the function to connect to the database
connectToDatabase();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization' );
    if (req.method === 'OPTIONS'){
        res.header( 'Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH','DELETE', 'GET')
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req, res, next)=>{
    res.status(error.status || 404);
    res.json({
        error: {
            message: error.message
        }
});
})
module.exports = app;