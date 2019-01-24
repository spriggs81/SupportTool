var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Credprofile = require("../models/credprofile");
var Users = require("../models/user");


// =====================
//  ADMIN ROUTES
// =====================
//Admin ladning page;
router.get("/", middleware.checkIsAdmin, function(req, res) {
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

router.put("/:use_id/changeview/:question", middleware.checkIsAdmin, function(req, res){
  var view = req.params.question;
  Users.findByIdAndUpdate(req.params.use_id, {defaultview: view}, function(err, Updateduser){
    if(err){
      req.flash('error', 'There was an error with your request: ' + err);
      res.redirect('/home');
    } else {
      req.flash('success', 'Your view has been updated!');
      res.redirect('/home');
    }
  });

});
