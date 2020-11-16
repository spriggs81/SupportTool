const express     = require("express"),
      router      = express.Router({mergeParams: true}),
      passport    = require("passport"),
      User        = require("../models/user"),
      Credprofile = require("../models/credprofile");


//root Router
router.get("/", (req, res) => {
    //res.redirect("/clients");
    res.render("landing");
});

//register form route
router.get("/register", (req, res) => {
   res.render('register');
});


//create user post route
router.post("/register", (req, res) => {
    var username = req.sanitize(req.body.username);
    var firstname = req.sanitize(req.body.firstname);
    var lastname = req.sanitize(req.body.lastname);
    Credprofile.find({}, function(err, foundprofiles){
        var foundprofile = foundprofiles[0];
        if(err){
            req.flash('error','Please report this issue to an admin!');
            res.redirect('/register');
       } else if(!foundprofile){
            req.flash('error', 'Missing Credentials Information, Please see Admin.');
            res.redirect('/');
       } else {
          const isAdmin = foundprofile.admin == req.body.code ? true : false;
          var newUser = new User({
              username: username,
              firstname: firstname,
              lastname: lastname,
              admin: isAdmin
          });
          User.register(newUser, req.body.password, (err, newUser) => {
              if(err){
                  console.log(err);
                  req.flash('error', err);
                  res.redirect("/register");
              } else {
                  req.flash('success', newUser.username + " has been added as a User!");
                  res.redirect("/");
              }
          });
        }
    });
});

//show login form
router.get("/login", (req, res) => {
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function (req, res) {
})

//logout route
router.get("/logout", (req, res) => {
    req.logout()
    req.flash('success', "You're Now Logged Out!!!")
    res.redirect("/");
})

module.exports = router;
