const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Dbvpnaccess = require("../models/dbvpnaccess");


//VPN Access Index Ruote
router.get("/vpnaccess", middleware.checkIsAdmin, (req, res) => {
    Dbvpnaccess.find({}).sort({'keyname': 1}).exec((err, foundAccesses) => {
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_vpnaccess/index", {accesses: foundAccesses});
        }
    });
});


//VPN Access New Route
router.post("/vpnaccess/new", middleware.checkIsAdmin, (req, res) => {
    var name = req.sanitize(req.body.name);
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"VPN Access can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/vpnaccess");
    } else {
        //checking for duplicates
        Dbvpnaccess.find({keyname: keyname}, function(err, foundAccess){
            if(err){
                req.flash('error', "Error with Finding DBVPNAccess!!!");
                res.redirect("/admin/db/vpnaccess");
            } else if(foundAccess == false){
                //adding new VPN Access to DB
                 Dbvpnaccess.create({name: name, keyname: keyname}, (err, newAccess) => {
                    if(err){
                        console.log(err);
                        req.flash('error', err + " error creating VPN Access");
                        res.redirect("/admin/db/vpnaccess");
                    } else {
                        req.flash('success', newAccess.name + " has been added to the VPN Access Database!");
                        res.redirect("/admin/db/vpnaccess");
                    }
                });
            } else {
                req.flash('error', 'This VPN Access Already Exist!');
                res.redirect("/admin/db/vpnaccess");
            }
        });
    }
});

//bd edit page routeEdit page
router.get("/vpnaccess/:dbvpnaccess_id/edit", middleware.checkIsAdmin, (req, res) => {
    Dbvpnaccess.findById(req.params.dbvpnaccess_id, (err, foundAccess) => {
        if(err){
            console.log(err);
            req.flash('error', "i'm an error");
            res.redirect('/admin/db/vpnaccess');
        } else {
            res.render('db_vpnaccess/edit', {access: foundAccess});
        }
    });
});


//DB VPN Access Edit Route
router.put("/vpnaccess/:dbvpnaccess_id/edit", middleware.checkIsAdmin, (req, res) => {
    var name = req.sanitize(req.body.name);
    //removing special chara and spaces
    var step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    var keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"VPN Access Name can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/vpnaccess");
    } else {
        //checking for duplicates
        Dbvpnaccess.find({keyname: keyname}, (err, foundAccess) => {
            if(err){
                req.flash('error',err);
                res.redirect("/admin/db/vpnaccess");
            } else if(foundAccess == false){
                //updating old VPN Access to new VPN Access name
                 Dbvpnaccess.findByIdAndUpdate(req.params.dbvpnccess_id,{name: name, keyname: keyname}, (err, updatedAccess) => {
                    if(err){
                        console.log(err);
                        req.flash('error', err);
                        res.redirect("/admin/db/vpnaccess");
                    } else {
                        req.flash('success', updatedAccess.name + " has been updated in the VPN Access Database!");
                        res.redirect("/admin/db/vpnaccess");
                    }
                });
            } else {
                req.flash('error', 'This VPN Access Already Exist!');
                res.redirect("/admin/db/vpnaccess");
            }
        });
    }
});


//delete route for DB Server
router.delete("/vpnaccess/:dbvpnaccess_id/delete", middleware.checkIsAdminDelete, (req, res) => {
    Dbvpnaccess.findByIdAndRemove(req.params.dbvpnaccess_id, (err) => {
        if(err){
            req.flash('error', "We could not delete this Server!!!");
            res.redirect("/vpnaccess");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/vpnaccess");
        }
    });
});

module.exports = router;
