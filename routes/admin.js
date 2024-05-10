const path=require('path');
const express=require('express');
const isAuth=require('../middleware/is-auth')
const adminController=require('../controllers/admin')
const { title } = require('process');
const router=express.Router();
router.get('/add-product',isAuth,adminController.getAddProduct);
router.get('/products',isAuth,adminController.getProducts);
router.post('/add-product',isAuth,adminController.postAddProduct);
router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);
router.post('/edit-product',isAuth,adminController.postEditroduct);
router.post('/delete-product',isAuth,adminController.postDeleteProduct);
module.exports=router;