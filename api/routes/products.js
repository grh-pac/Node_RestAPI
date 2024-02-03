const express = require('express');
const multer = require('multer');
const checAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');
const router  = express.Router();

var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './uploads');
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },

})
const fileFilter = (req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false)
    }
};

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('productImage');


router.get('/', ProductController.get_all_products);
router.post('/',checAuth,upload, ProductController.create_product);
router.get('/:productId',checAuth,ProductController.get_product_by_id);
router.patch('/:productId',checAuth, ProductController.update_product);
router.delete('/:productId',checAuth, ProductController.delete_product);
 

module.exports = router;