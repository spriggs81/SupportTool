var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Credprofile = require("../models/credprofile");


// =====================
//  ADMIN ROUTES
// =====================
//Admin ladning page;
router.get("/", middleware.isLoggedIn, function(req, res) {
    Credprofile.find({}, function(err, foundProfiles){
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("admin/index", {profile: foundProfiles[0]});
        }
    });
});

module.exports = router;