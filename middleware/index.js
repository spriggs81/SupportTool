var Mainmessage = require("../models/mainmessage");
var Replymessage = require("../models/replymessage");

//all middleware
var middlewareObj = {};


middlewareObj.checkMessageOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Mainmessage.findById(req.params.id, function(err, foundMessage){
            if(err){
                console.log(err || !foundMessage);
                req.flash("error","Can Not Find Message!");
                res.redirect("back");
            } else {
                //does user own the campground
                if(foundMessage.creator._id.equals(req.user._id) || req.user.admin == true){
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
        //does user own the campground
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
                //does user own the campground
                if(foundComment.author.id.equals(req.user._id) || req.user.admin == true){
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