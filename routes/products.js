const express = require("express"),
      router = express.Router({mergeParams: true}),
      Client = require("../models/client"),
      Product = require("../models/product"),
      middleware = require("../middleware"),
      Dbproduct = require("../models/dbproduct");

//==========================
//   PRODUCT ROUTES
//==========================
//Production Index Route
router.get("/", middleware.isLoggedIn, (req, res) => {
    Client.findById(req.params.id).populate("products").exec((err, foundClient) => {
        if(err){
            req.flash('error',  'We cannot find the Client!!!');
            res.redirect("/clients");
        } else{
            res.render("products/index", {client:foundClient});
        }
    });
});


//Add New Product Form Route (Updated)
router.get("/new", middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', 'We cannot find the Client!!!')
            console.log(err);
            res.redirect("/clients/:id/products/new");
        } else {
            Dbproduct.find({}).sort({'keyname': 1}).exec((err, foundProducts) => {
                if(err){
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
router.post("/", middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, client) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            return res.redirect("/clients/" + req.params.id + "/products/new");
        }
        Product.create(req.body.product, (err, product) => {
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
router.get("/:product_id", middleware.isLoggedIn, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "Can't find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, (err, foundProduct) => {
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
router.get('/:product_id/edit', middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, (err, oldProduct) => {
                if(err){
                    req.flash('error',"We cannot find this Product!");
                    res.redirect("/clients/:id/products");
                } else {
                     Dbproduct.find({}).sort({'keyname': 1}).exec((err, foundProducts) => {
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
router.put("/:product_id", middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We connot find the Client!!!");
            res.redirect("/clients");
        } else {
            Product.findByIdAndUpdate(req.params.product_id, req.body.product, (err, updatedProduct) => {
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
router.delete("/:product_id", middleware.checkIsAdminDelete,  (req, res) => {
    Product.findByIdAndRemove(req.params.product_id, (err) => {
        if(err){
            console.log(err);
        } else {
            Client.findById(req.params.id, (err, client) => {
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
router.get('/:product_id/menu', middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Product.findById(req.params.product_id, (err, foundProduct) => {
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
