var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Dbsupportplan = require("../models/dbsupportplan");


//Product Index Ruote
router.get("/supportplan", middleware.checkIsAdmin, function(req, res) {
    Dbsupportplan.find({}).sort({'keyname': 1}).exec(function(err, foundPlans){
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_supportplan/index", {plans: foundPlans});
        }
    });
});


//Product New Route
router.post("/supportplan/new", middleware.checkIsAdmin, function(req, res) {
    var name = req.sanitize(req.body.name);
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Support Plan can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/supportplan");
    } else {
        //checking for duplicates
        Dbsupportplan.find({keyname: keyname}, function(err, foundPlan){
            if(err){
                req.flash('error', "Error with Finding DBSUPPORTPLAN!!!");
                res.redirect("/admin/db/supportplan");
            } else if(foundPlan == false){
                //adding new product to DB
                 Dbsupportplan.create({name: name, keyname: keyname}, function(err, newPlan){
                    if(err){
                        console.log(err);
                        req.flash('error', err+" error creating Support Plan");
                        res.redirect("/admin/db/supportplan");
                    } else {
                        req.flash('success', newPlan.name + " has been added to the Support Plan Database!");
                        res.redirect("/admin/db/supportplan");
                    }
                });
            } else {
                req.flash('error', 'This Support Plan Already Exist!');
                res.redirect("/admin/db/supportplan");
            }
        });
    }
});

//bd edit page routeEdit page
router.get("/supportplan/:dbsupportplan_id/edit", middleware.checkIsAdmin, function(req, res){
    Dbsupportplan.findById(req.params.dbsupportplan_id, function(err, foundPlan){
        if(err){
            console.log(err);
            req.flash('error', "i'm an error");
            res.redirect('/admin/db/supportplan');
        } else {
            res.render('db_supportplanedit', {product: foundPlan});
        }
    });
});


//DB Product Edit Route
router.put("/supportplan/:dbsupportplan_id/edit", middleware.checkIsAdmin, function(req, res) {
    var name = req.sanitize(req.body.name);
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Product Name can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/supportplan");
    } else {
        //checking for duplicates
        Dbsupportplan.find({keyname: keyname}, function(err, foundPlan){
            if(err){
                req.flash('error',err);
                res.redirect("/admin/db/supportplan");
            } else if(foundPlan == false){
                //updating old product to new product name
                 Dbsupportplan.findByIdAndUpdate(req.params.dbsupportplan_id,{name: name, keyname: keyname}, function(err, updatedPlan){
                    if(err){
                        console.log(err);
                        req.flash('error', err);
                        res.redirect("/admin/db/supportplan");
                    } else {
                        req.flash('success', updatedPlan.name + " has been updated in the Product Database!");
                        res.redirect("/admin/db/supportplan");
                    }
                });
            } else {
                req.flash('error', 'This Product Already Exist!');
                res.redirect("/admin/db/supportplan");
            }
        });
    }
});


//delete route for DB Server
router.delete("/supportplan/:dbsupportplan_id/delete", middleware.checkIsAdminDelete, function(req, res){
    Dbsupportplan.findByIdAndRemove(req.params.dbsupportplan_id, function(err) {
        if(err){
            req.flash('error', "We could not delete this Server!!!");
            res.redirect("/supportplan");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/supportplan");
        }
    });
});

module.exports = router;
