const mongoose    = require("mongoose"),
      Mainmessage = require("../models/mainmessage"),
      Replymessage = require("../models/replymessage");

//all middleware
const middlewareObj = {};


middlewareObj.checkMessageOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Mainmessage.findById(req.params.message_id, (err, foundMessage) => {
            if(err){
                console.log(err || !foundMessage);
                req.flash("error","Can Not Find Message!");
                res.redirect("back");
            } else {
                //does user own the Message
                if(foundMessage.creator._id == req.user._id || req.user.admin == true){
                    next();
                } else {
                    req.flash("error","You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkIsAdmin = (req, res, next) => {
    if(req.isAuthenticated()){
        //does user have admin rights
        if(req.user.admin == true){
            next();
        } else {
            req.flash("error","You don't have permissions to do that!");
            res.redirect("back");
        }
    }else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkIsAdminDelete = (req, res, next) => {
    if(req.isAuthenticated()){
        //does user have admin rights
        if(req.user.admin !== true || req.user.username == 'admin_user'){
          req.flash("error","You don't have permissions to do that!");
          res.redirect("back");
        } else {
          next();
        }
    }else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Replymessage.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error","Comment not found!");
                console.log(err);
                res.redirect("back");
            } else {
                //does user own the comment
                if(foundComment.creator._id == req.user._id || req.user.admin == true){
                    next();
                } else {
                    req.flash("error","You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;
