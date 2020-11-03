const express     = require("express"),
      router      = express.Router({mergeParams: true}),
      Users       = require("../models/user"),
      middleware  = require("../middleware");

//root Router
router.get("/", middleware.isLoggedIn, (req, res) => {
     var userinfo = req.user;
     Users.findById(userinfo, (err, foundSetting) => {
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
