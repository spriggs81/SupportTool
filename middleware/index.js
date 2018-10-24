//all middleware
var middlewareObj = {};


/*middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err || !foundCampground);
                req.flash("error","Can Not Find Campground!");
                res.redirect("back");
            } else {
                //does user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
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
}*/

/*middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error","Comment not found!")
                console.log(err);
                res.redirect("back");
            } else {
                //does user own the campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();    
                } else {
                    req.flash("error","You don't have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("error","You need to be logged in to do that!")
        res.redirect("back");
    }
}*/

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;