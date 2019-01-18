var express     = require("express");
var router      = express.Router({mergeParams: true});
var passport    = require("passport");
var User        = require("../models/user");
var Credprofile = require("../models/credprofile");
var middleware  = require("../middleware");


//root Router
router.get("/", middleware.isLoggedIn, function(req, res){
    //res.redirect("/clients");
    res.render("home/home");
});

module.exports = router;