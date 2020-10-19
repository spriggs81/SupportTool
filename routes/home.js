const express     = require("express"),
      router      = express.Router({mergeParams: true}),
      Settings    = require("../models/usersettings"),
      middleware  = require("../middleware");

//root Router
router.get("/", middleware.isLoggedIn, (req, res) => {
     var userinfo = req.user;
     Settings.findById(userinfo.settings, (err, foundSetting) => {
          if(err){
               return JSON.parser(err.message);
          } else {
               res.render("home/home", {userinfo: userinfo, settings: foundSetting});
          }
     })
});

router.post("/", middleware.isLoggedIn,function(req, res){

})

module.exports = router;
