var express = require("express");
var router = express.Router({mergeParams: true});
var Client = require("../models/client");
var Product = require("../models/product");
var Appserver = require("../models/appserver");
var DBserver = require("../models/dbserver");
var User = require("../models/user");
var middleware = require("../middleware");
var Dbproduct = require("../models/dbproduct");

//==========================
//   PRODUCT ROUTES
//==========================
//Production Index Route
router.get("/", middleware.isLoggedIn, function(req, res) {
    Client.findById(req.params.id).populate("products").exec(function(err, foundClient) {
        if(err){
            req.flash('error',  'We cannot find the Client!!!');
            res.redirect("/clients");
        } else{
            res.render("products/index", {client:foundClient});
        }
    });
});


//Add New Product Form Route (Updated)
router.get("/new", middleware.checkIsAdmin, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient) {
        if(err){
            req.flash('error', 'We cannot find the Client!!!')
            console.log(err);
            res.redirect("/clients/:id/products/new");
        } else {
            Dbproduct.find({}).sort({'keyname': 1}).exec(function(err, foundProducts){
                if(err){
                    console.log(err);
                    req.flash('error', 'please report to an admin!');
                    res.redirect('/');
                } else {
                    res.render("products/new", {client: foundClient, products: foundProducts});
                }
            });
        }
    });
});


//Add New Product
router.post("/", middleware.checkIsAdmin, function(req, res){
    Client.findById(req.params.id, function(err, client) {
        if(err){
            console.log(err);
            req.flash('error', "We cannot find the Client!!!");
            return res.redirect("/clients/" + req.params.id + "/products/new");
        }
        Product.create(req.body.product, function(err, product){
            if(err){
                req.flash('error', "There was an error adding the product to the user, try again");
            } else{
                client.products.push(product);
                client.save();
                req.flash('success', "You have added a New Product to " + client.name);
                res.redirect('/clients/' + req.params.id +'/products/new');
            }
        });
    });
});

//products show page
router.get("/:product_id", middleware.isLoggedIn, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient) {
        if(err){
            req.flash('error', "Can't find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, function(err, foundProduct) {
                if(err){
                    req.flash('error', "Can't find this Product!!!");
                    res.redirect("/clients/"+req.params.id);
                } else{
                    res.render("products/show", {client: foundClient, product: foundProduct});
                }
            });
        }
    });
});

//Get Product Edit Form (Updated)
router.get('/:product_id/edit', middleware.checkIsAdmin, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient) {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, function(err, oldProduct){
                if(err){
                    req.flash('error',"We cannot find this Product!");
                    console.log(err);
                    res.redirect("/clients/:id/products");
                } else {
                     Dbproduct.find({}).sort({'keyname': 1}).exec(function(err, foundProducts){
                        if(err){
                            console.log(err);
                            req.flash('error', 'please report to an admin!');
                            res.redirect('/');
                        } else {
                            res.render("products/edit", {client: foundClient, oldProduct: oldProduct, products:foundProducts});
                            //res.render("products/new", {client: foundClient, products: foundProducts});
                        }
                    });
                }
            });
        }
    });
});

//Product Edit route
router.put("/:product_id", middleware.checkIsAdmin, function(req, res){
    Client.findById(req.params.id, function(err, foundClient) {
        if(err){
            req.flash('error', "We connot find the Client!!!");
            res.redirect("/clients");
        } else {
            Product.findByIdAndUpdate(req.params.product_id, req.body.product, function(err, updatedProduct){
                if(err){
                    req.flash('error', "We cannot find Product!!!");
                    res.redirect("/clients/"+req.params.id+"/products/");
                } else {
                    req.flash('success', "You have updated this Product");
                    res.redirect("/clients/"+req.params.id+"/products/"+req.params.product_id);
                }
            });
        }
    });
});

//Delete a Product
router.delete("/:product_id", middleware.checkIsAdminDelete, function(req, res){
    Product.findByIdAndRemove(req.params.product_id, function(err){
        if(err){
            console.log(err);
        } else {
            Client.findById(req.params.id, function(err, client) {
                if(err){
                    console.log(err);
                }
                req.flash('success', "You have removed this product from " + client.name);
                res.redirect("/clients/" + req.params.id);
            });
        }
    });
});

//Product Menu Route
router.get('/:product_id/menu', middleware.checkIsAdmin, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient) {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, function(err, foundProduct){
                if(err){
                    req.flash('error',"We cannot find this Product!");
                    console.log(err);
                    res.redirect("/clients/:id/products");
                } else {
                  res.render("products/menu", {client: foundClient, product: foundProduct});
                }
            });
        }
    });
});

module.exports = router;
