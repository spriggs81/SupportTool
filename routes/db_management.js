var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Dbmanagement = require("../models/management");


//Product Index Ruote
router.get("/management", middleware.checkIsAdmin, function(req, res) {
    Dbmanagement.find({}).sort({'keyword': 1}).exec(function(err, foundManagement){
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_management/index", {managers: foundManagement});
        }
    });
});


//Product New Route
router.post("/management/new", middleware.checkIsAdmin, function(req, res) {
    var name = req.body.firstname + ' ' + req.body.lastname;
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"management fields can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/management");
    } else {
        //checking for duplicates
        Dbmanagement.find({keyword: keyname}, function(err, foundStatus){
            if(err){
                req.flash('error', "Error with Finding Dbmanagement!!!");
                res.redirect("/admin/db/management");
            } else if(foundStatus == false){
                //adding new product to DB
                 Dbmanagement.create({firstname: req.body.firstname, lastname: req.body.lastname, role: req.body.role, keyword: keyname}, function(err, newManager){
                    if(err){
                        console.log(err);
                        req.flash('error', err+" error creating client status");
                        res.redirect("/admin/db/clientstatus");
                    } else {
                        req.flash('success', newManager.firstname + ' ' + newManager.lastname + " has been added to the Client Status Database!");
                        res.redirect("/admin/db/management");
                    }
                });
            } else {
                req.flash('error', 'This Manager Already Exist!');
                res.redirect("/admin/db/management");
            }
        });
    }
});

//bd edit page routeEdit page
router.get("/management/:Dbmanagement_id/edit", middleware.checkIsAdmin, function(req, res){
    Dbmanagement.findById(req.params.Dbmanagement_id, function(err, foundManager){
        if(err){
            console.log(err);
            req.flash('error', "i'm an error");
            res.redirect('/admin/db/management');
        } else {
            res.render('db_management/edit', {manager: foundManager});
        }
    });
});


//DB Product Edit Route
router.put("/management/:Dbmanagement_id/edit", middleware.checkIsAdmin, function(req, res) {
    var name = req.body.firstname + ' ' + req.body.lastname;
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Management fields can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/management");
    } else {
        //checking for duplicates
        Dbmanagement.find({keyword: keyname}, function(err, foundManager){
          var prekey1 = foundManager[0]._id
          if(err){
            req.flash('error',err);
            res.redirect("/admin/db/management");
          } else if(foundManager == false || prekey1 == req.params.Dbmanagement_id){
            //updating old product to new product name
            Dbmanagement.findByIdAndUpdate(req.params.Dbmanagement_id,{firstname: req.body.firstname, lastname: req.body.lastname, role: req.body.role, keyword: keyname}, function(err, updatedManager){
              if(err){
                console.log(err);
                req.flash('error', err);
                res.redirect("/admin/db/management");
              } else {
                req.flash('success', updatedManager.firstname + ' ' + updatedManager.lastname + " has been updated in the Client Status Database!");
                res.redirect("/admin/db/management");
              }
            });
          } else {
            req.flash('error', 'This Manager Already Exist!');
            res.redirect("/admin/db/management");
          }
        });
      }
    });


//delete route for DB Server
router.delete("/management/:Dbmanagement_id/delete", middleware.checkIsAdminDelete, function(req, res){
    Dbmanagement.findByIdAndRemove(req.params.Dbmanagement_id, function(err) {
        if(err){
            req.flash('error', "We could not delete this Manager!!!");
            res.redirect("/management");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/management");
        }
    });
});

module.exports = router;
