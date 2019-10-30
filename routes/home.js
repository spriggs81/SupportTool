var express     = require("express");
var router      = express.Router({mergeParams: true});
var passport    = require("passport");
var User        = require("../models/user");
var Settings    = require("../models/usersettings");
var Credprofile = require("../models/credprofile");
var middleware  = require("../middleware");


//root Router
router.get("/", middleware.isLoggedIn, function(req, res){
     var userinfo = req.user;
     Settings.findById(userinfo.settings, function(err, foundSetting){
          if(err){
               return JSON.parser(err.message);
          } else {
               res.render("home/home", {userinfo: userinfo, settings: foundSetting});
          }
     })
     //res.redirect("/clients");
});

router.post("/", middleware.isLoggedIn,function(req, res){

})

module.exports = router;
