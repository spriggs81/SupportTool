const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Dbproduct = require("../models/dbproduct");


//Product Index Ruote
router.get("/products", middleware.checkIsAdmin, (req, res) => {
    Dbproduct.find({}).sort({'keyname': 1}).exec((err, foundProducts) => {
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_product/index", {products: foundProducts});
        }
    });
});


//Product New Route
const productnew = ["/products/new", "/knowledge"];
router.post(productnew, middleware.checkIsAdmin, (req, res) => {
     const route = req.url;
     const name = req.sanitize(req.body.name);
     //removing special chara and spaces
     const step1 = name.replace(/[^A-Z0-9]/ig, "");
     //turning to lower case  -  used to help with dup entries
     const keyname = step1.toLowerCase();
     //checking to make sure that the entry isn't blank or not sense
     console.log(route);
     if(keyname === ''){
          req.flash('error',"Product Name can't be blank, only numbers or symbols!");
          if (route == "/knowledge"){
              res.redirect("/knowledge");
         } else {
             res.redirect("/admin/db/products");
        }
     } else {
        //checking for duplicates
        Dbproduct.find({keyname: keyname}, (err, foundProduct) => {
            if(err){
                 req.flash('error', "Error with Finding DBPRODUCT!!!");
                 if (route == "/knowledge"){
                      res.redirect("/knowledge");
                 } else {
                      res.redirect("/admin/db/products");
                 }
            } else if(foundProduct == false){
                //adding new product to DB
               Dbproduct.create({name: name, keyname: keyname}, (err, newProduct) => {
                     if(err){
                          console.log(err);
                          req.flash('error', err+" error creating dbproduct");
                          if (route == "/knowledge"){
                               res.redirect("/knowledge");
                          } else {
                               res.redirect("/admin/db/products");
                          }
                     } else {
                          req.flash('success', newProduct.name + " has been added to the Product Database!");
                          if (route == "/knowledge"){
                              res.redirect("/knowledge");
                         } else {
                             res.redirect("/admin/db/products");
                         }
                    }
               });
          } else {
               req.flash('error', 'This Product Already Exist!');
               if (route == "/knowledge"){
                   res.redirect("/knowledge");
              } else {
                  res.redirect("/admin/db/products");
             }
          }
     });
     }
});

//bd edit page routeEdit page
router.get("/products/:dbproduct_id/edit", middleware.checkIsAdmin, (req, res) => {
    Dbproduct.findById(req.params.dbproduct_id, (err, foundProduct) => {
        if(err){
            console.log(err);
            req.flash('error', "i'm an error");
            res.redirect('/admin/db/products');
        } else {
            res.render('db_product/edit', {product: foundProduct});
        }
    });
});


//DB Product Edit Route
router.put("/products/:dbproduct_id/edit", middleware.checkIsAdmin, (req, res) => {
    const name = req.sanitize(req.body.name);
    //removing special chara and spaces
    const step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    const keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Product Name can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/products");
    } else {
        //checking for duplicates
        Dbproduct.find({keyname: keyname}, (err, foundProduct) => {
            if(err){
                req.flash('error',err);
                res.redirect("/admin/db/products");
            } else if(foundProduct == false){
                //updating old product to new product name
                 Dbproduct.findByIdAndUpdate(req.params.dbproduct_id,{name: name, keyname: keyname}, (err, updatedProduct) => {
                    if(err){
                        console.log(err);
                        req.flash('error', err);
                        res.redirect("/admin/db/products");
                    } else {
                        req.flash('success', updatedProduct.name + " has been updated in the Product Database!");
                        res.redirect("/admin/db/products");
                    }
                });
            } else {
                req.flash('error', 'This Product Already Exist!');
                res.redirect("/admin/db/products");
            }
        });
    }
});


//delete route for DB Server
router.delete("/products/:dbproduct_id/delete", middleware.checkIsAdminDelete, (req, res) => {
    Dbproduct.findByIdAndRemove(req.params.dbproduct_id, (err) => {
        if(err){
            req.flash('error', "We could not delete this Server!!!");
            res.redirect("/products");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/products");
        }
    });
});

module.exports = router;
