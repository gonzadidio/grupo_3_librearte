const db = require('../database/models');
const { validationResult } = require('express-validator');
const serverErr = require('../middlewares/serverErrMiddleware');


const controller = {
    index: (req, res) => {
        const pedidoCategories = db.Product_Category.findAll();
        const pedidoProducts = db.Product.findAll();
        Promise.all([pedidoProducts, pedidoCategories])
        .then(function ([products, categories]){
            res.render('./products/products', { products, categories});
        })
        .catch(error =>{
            serverErr(error,res)
        })
    },

    productDetail: (req, res) => {
        const { id } = req.params;
        db.Product.findByPk(id)
        .then(function (product){
            res.render('./products/productDetail', { product })
        })
        .catch(error =>{
            serverErr(error,res)
        })
    },
    productAdd: (req, res) => {
        res.render('./products/productAdd');
    },
    create: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.render('./products/productAdd', { errors: errors.mapped() });
        }
        const image = req.file;
        const newProduct = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            img: !image ? "default.png" : image.filename,
            products_categories_id: req.body.category
        }
        try {
            db.Product.create(newProduct);
            res.redirect('/products')
        }
        catch{error =>{
            serverErr(error,res)
        }}
    },
    productEdit: (req, res) => {
        const {id} = req.params;
        const pedidoCategory = db.Product_Category.findAll();
        const pedidoProduct = db.Product.findByPk(id);
        Promise.all([pedidoProduct, pedidoCategory])
            .then(function([product,category]){
                res.render('./products/productEdit', { product , category});
            })
            .catch(error => {
                res.send({error})
            })
    },
    productUpdate: async (req, res) => {
        const {id} = req.params;
        try {
            db.Product.update({
                ...req.body,
                products_categories_id: req.body.category,
                img: req.file ? req.file.filename : this.img
            }, {
                where: {
                    id: id
                }
            });
            res.redirect('/products')        
        }
        catch (error){
            res.send({error})
        }                 
    }        
    ,
     destroy: async (req, res) => {
        const {id} = req.params;
        try {
            db.Product.destroy({
                where: {
                    id: id
                }
            });
            res.redirect('/products')        
        }
        catch (error){
            res.send({error})
        }                  
    }
}

module.exports = controller;