var mongoose         = require("mongoose");
var Mainmessage = require("../models/mainmessage");
var Replymessage = require("../models/replymessage");

//all middleware
var middlewareObj = {};


middlewareObj.checkMessageOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        console.log("this is user: " + req.user._id);
        Mainmessage.findById(req.params.message_id, function(err, foundMessage){
        console.log("this is from params: " + foundMessage.creator._id);
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

middlewareObj.checkIsAdmin = function(req, res, next){
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

middlewareObj.checkCommentOwnership = function(req, res, next){
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;