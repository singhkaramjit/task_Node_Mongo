//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
//Creating a Router
var router = express.Router();
//Link
const Product = mongoose.model('Product');
 
//Router Controller for READ request
router.get('/',(req, res) => {
    res.render("product/productAddEdit", {
        viewTitle: ""
    });
});
 
//Router Controller for UPDATE request
router.post('/', (req,res) => {
if (req.body._id == '')
    insertIntoMongoDB(req, res);
});
 
//Creating function to insert data into MongoDB
function insertIntoMongoDB(req,res) {
    var product = new Product();
    product.userId = req.body.userId;
    product.viewDate = req.body.viewDate;
    product.productId = req.body.productId;
    product.save((err, doc) => {
    if (!err)
        res.redirect('product/list');
    else
        console.log('Error during record insertion : ' + err);
    });
}
  
 
//Router to retrieve the complete list of available Products
router.get('/list', async(req,res) => {
    var productId = [];
    await Product.distinct('productId', (err, count) => {
        productId=count;
    });  
    Product.find((err, docs) => {
        if(!err){
            res.render("product/list", {
            list: JSON.parse(JSON.stringify(docs)),
            productId: JSON.parse(JSON.stringify(productId))
        });
        }
        else {
            console.log('Failed to retrieve the Product List: '+ err);
        }
    });
});

//Router to retrieve the complete list of available Products
router.get('/show', async(req,res) => {

    let pProductId =  req.query.searchProductId;
    let pDateFrom =  req.query.searchDateFrom;
    let pDateTo =  req.query.searchDateTo;

    var totlrecordcount=0;
    var totldistinctrecordcount=0;
    var productId = [];

    Product.count({productId: pProductId,viewDate:{ $gte: pDateFrom, $lte: pDateTo } },(err, count) => {
        totlrecordcount=count;
    });

    await Product.distinct('userId',{productId: pProductId,viewDate:{ $gte: pDateFrom, $lte: pDateTo } },(err, count) => {
        totldistinctrecordcount=count.length;
    });    

    await Product.distinct('productId', (err, count) => {
        productId=count;
    });  
       
   Product.find({productId: pProductId,viewDate:{ $gte: pDateFrom, $lte: pDateTo } },(err, docs) => {
    if(!err){
        res.render("product/list", {
            list: JSON.parse(JSON.stringify(docs)),
            pTotalUsers:totlrecordcount,
            pTotalDistinctUsers:totldistinctrecordcount,
            productId: JSON.parse(JSON.stringify(productId))
        });
    }
    else {
        console.log('Failed to retrieve the Product List: '+ err);
    }
    });
});
 
//Creating a function to implement input validations
function handleValidationError(err, body) {
for (field in err.errors) {
    switch (err.errors[field].path) {
    case 'userId':
    body['userIdError'] = err.errors[field].message;
    break;
    default:
    break;
    }
}
}
   
//Router Controller for DELETE request
router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
    res.redirect('/product/list');
    }
    else { console.log('Failed to Delete Product Details: ' + err); }
    });
    });
      
module.exports = router;