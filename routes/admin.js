const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Credprofile = require("../models/credprofile"),
      Users = require("../models/user");


// =====================
//  ADMIN ROUTES
// =====================
//Admin ladning page;
router.get("/", middleware.checkIsAdmin, (req, res) => {
    Credprofile.find({}, (err, foundProfiles) => {
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
