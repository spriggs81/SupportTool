var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Dbdepartment = require("../models/departandtitle");


//Product Index Ruote
router.get("/departments", middleware.checkIsAdmin, function(req, res) {
    Dbdepartment.find({}).sort({'department': 1, 'title': 1}).exec(function(err, foundDeparts){
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_department/index", {departs: foundDeparts});
        }
    });
});


//Department and Title New Route
router.post("/departments/new", middleware.checkIsAdmin, function(req, res) {
    //adding new product to DB
    Dbdepartment.create({department: req.body.department, title: req.body.title}, function(err, newdepart){
        if(err){
            console.log(err);
            req.flash('error', err+" error creating department and title");
            res.redirect("/admin/db/departments");
        } else {
            req.flash('success', "This has been added to the Database!");
            res.redirect("/admin/db/departments");
        }
    });
});

//bd edit page routeEdit page
router.get("/departments/:Dbdepartment_id/edit", middleware.checkIsAdmin, function(req, res){
    Dbdepartment.findById(req.params.Dbdepartment_id, function(err, foundDepart){
        if(err){
            console.log(err);
            req.flash('error', "Error editing department");
            res.redirect('/admin/db/departments');
        } else {
            res.render('db_department/edit', {depart: foundDepart});
        }
    });
});


//DB Product Edit Route
router.put("/departments/:Dbdepartment_id/edit", middleware.checkIsAdmin, function(req, res) {
    Dbdepartment.findByIdAndUpdate(req.params.Dbdepartment_id,{department: req.body.department, title: req.body.title}, function(err, updatedDepart){
      if(err){
        console.log(err);
        req.flash('error', err);
        res.redirect("/admin/db/departments");
      } else {
        req.flash(foundDepart.department + " / " + foundDepart.title + " has been updated in the Database!");
        res.redirect("/admin/db/departments");
      }
  });
});


//delete route for DB Server
router.delete("/department/:Dbdepartment_id/delete", middleware.checkIsAdminDelete, function(req, res){
    Dbdepartment.findByIdAndRemove(req.params.Dbdepartment_id, function(err) {
        if(err){
            req.flash('error', "We could not delete this!!!");
            res.redirect("/department");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/department");
        }
    });
});

module.exports = router;
