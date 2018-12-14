var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Credprofile = require("../models/credprofile");
var middleware = require("../middleware");


//admin user index page
router.get("/", middleware.checkIsAdmin, function(req, res) {
    User.find({}, function(err, foundUsers){
        if(err){
            req.flash('error', 'We cannot find any Users!!!');
            res.redirect("/admin");
        } else {
            res.render("admin_user/index", {users: foundUsers});
        }
    });
});

//user creds create page route
router.get("/profile/:profile_id/:creds", middleware.checkIsAdmin, function(req, res) {
    Credprofile.findById(req.params.profile_id, function(err, foundCredprofile) {
        if(err){
            console.log(err);
            req.flash('error','Please report this issue to an admin!');
            res.redirect('/profile');
        } else {
            res.render("admin_user/newcreds",{credprofile: foundCredprofile, creds: req.params.creds});
        }
    });
});

//user creds create route
router.put("/profile/:profile_id/:creds", middleware.checkIsAdmin, function(req, res){
    Credprofile.findById(req.params.profile_id, function(err, foundMe){
        console.log(req.params.profile_id);
        if(err){
            console.log(err);
            req.flash('error','Please inform a admin of this error.!');
            res.redirect('/admin');
        } else{
            if(req.body.user == foundMe.admin || req.body.admin == foundMe.user){
                req.flash('error','user profile code cannot be the same as admin!');
                res.redirect('/admin/users/profile/'+foundMe._id+'/'+req.params.creds);
            } else {
                if(req.body.admin == null){
                    Credprofile.findByIdAndUpdate(req.params.profile_id, {user: req.body.user}, function(err, foundProfile){
                       if(err){
                           console.log(err);
                           req.flash('error', 'error updating profile info, please inform a admin!');
                       } else {
                            req.flash('success', 'Profile Code has been Updated!');
                            res.redirect('/admin/users/profile/'+foundProfile._id+'/'+req.params.creds);
                       }
                    });
                } else if(req.body.user == null){
                    Credprofile.findByIdAndUpdate(req.params.profile_id, {admin: req.body.admin}, function(err, foundProfile){
                       if(err){
                           console.log(err);
                           req.flash('error', 'error updating profile info, please inform a admin!');
                       } else {
                            req.flash('success', 'Profile Code has been Updated!');
                            res.redirect('/admin/users/profile/'+foundProfile._id+'/'+req.params.creds);
                       }    
                    });
                } else{
                    req.flash('error', 'You have a problem now.')
                }                
            }
        }
    });
});


//user delete route
router.delete("/:user_id", middleware.checkIsAdmin, function(req, res) {
    User.findByIdAndRemove(req.params.user_id, function(err){
        if(err){
            console.log(err);
            req.flash('error', 'We cannot find this User!!!');
            res.redirect("/admin");
        } else {
            res.redirect("/index");
        }
    });
});

module.exports = router;