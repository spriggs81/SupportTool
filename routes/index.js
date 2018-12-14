var express     = require("express");
var router      = express.Router({mergeParams: true});
var passport    = require("passport");
var User        = require("../models/user");
var Credprofile = require("../models/credprofile");
var middleware  = require("../middleware");


//root Router
router.get("/", function(req, res){
    //res.redirect("/clients");
    res.render("landing");
});

//register form route
router.get("/register", function(req, res) {
   res.render('register'); 
});


//create user post route
router.post("/register", function(req, res) {
    var username = req.sanitize(req.body.username);
    var firstname = req.sanitize(req.body.firstname);
    var lastname = req.sanitize(req.body.lastname);
    Credprofile.find({}, function(err, foundprofiles){
        var foundprofile = foundprofiles[0];
        if(err){
            console.log(err);
            req.flash('error','Please report this issue to an admin!');
            res.redirect('/register');
        } else {
            if(req.body.code == foundprofile.user){
                var newUser = new User({
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    admin: false
                });
                User.register(newUser, req.body.password, function(err, newUser) {
                    if(err){
                        console.log(err);
                        req.flash('error', err);
                        res.redirect("/register");
                    } else {
                        req.flash('success', newUser.username + " has been added as a User!");
                        res.redirect("/");
                    }
                });
            } else if(req.body.code == foundprofile.admin){
                var newUser = new User({
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    admin: true
                });
                User.register(newUser, req.body.password, function(err, newUser) {
                    if(err){
                        console.log(err);
                        req.flash('error', err.message);
                        res.redirect("/register");
                    } else {
                        req.flash('success', newUser.username + " has been added as a User!");
                        res.redirect("/");
                    }
                });
            } else {
                req.flash('error',"The code you are trying to use wasn't found, please try again!");
                res.redirect('/register');
            }
        }
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/clients",
        failureRedirect: "/login"
    }), function (req, res) {
})

//logout route
router.get("/logout", function(req, res) {
    req.logout()
    req.flash('success', "You're Now Logged Out!!!")
    res.redirect("/");
})

module.exports = router;