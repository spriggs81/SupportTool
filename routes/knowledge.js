var express         = require("express");
var router          = express.Router({mergeParams: true});
var Mainmessage     = require("../models/mainmessage");
var Replymessage    = require("../models/replymessage");
var middleware      = require("../middleware");

//Landing Route
router.get("/", middleware.isLoggedIn, function(req, res) {
    res.render("knowledge/landing");
});

//Index Route
router.get("/:productName", middleware.isLoggedIn, function(req, res) {
    var productName = req.params.productName;
    Mainmessage.find({}, function(err, allMessages){
        if(err){
            req.flash('error', "Cannot find Messages!");
            res.redirect("/knowledge");
        } else {
            res.render("knowledge/pickOne", {productName: req.params.productName, messages: allMessages});
        }        
    });
});

//New Form Route
router.get("/:productName/:messageType/new", middleware.isLoggedIn, function(req, res) {
   res.render("knowledge/new", {productName:req.params.productName, messageType: req.params.messageType}); 
});

//New Route
router.post("/:productName/:messageType/new", middleware.isLoggedIn, function(req, res) {
    var product = req.params.productName;
    var type = req.params.messageType;
    var creator = req.user;
    var desc = req.body.desc;
    var message = req.body.message;
    var newMessage = {product: product, type: type, creator:creator, desc:desc, message:message};
    Mainmessage.create(newMessage, function(err, newMainMessage){
       if(err){
           req.flash('error', "We Cannot Add This New Message to Knowledge Base!");
           res.redirect("/knowledge");
       } else {
           req.flash('success', "This New Message has been Added to Knowledge Base!");
           res.redirect("/knowledge/" + req.params.productName + "/");
       }
    });
});

//show Route
router.get("/:productName/:messageType/:message_id", middleware.isLoggedIn, function(req, res) {
    Mainmessage.findById(req.params.message_id).populate("replies").exec(function(err, message){
        if(err){
            req.flash('error', "Cannot find Messages!");
            console.log(err.message);
            res.redirect("/knowledge");
        } else {
            res.render("knowledge/show", {message: message});
        }        
    });
});

//comment form Route
router.get("/:productName/:messageType/:message_id/comment/add", middleware.isLoggedIn, function(req, res) {
    Mainmessage.findById(req.params.message_id, function(err, message){
        if(err){
            req.flash('error', "Cannot find Messages!");
            res.redirect("/knowledge");
        } else {
            res.render("knowledge/comment", {message: message});
        }        
    });
});

//Post comment Route
router.post("/:productName/:messageType/:message_id/comment", middleware.isLoggedIn, function(req, res) {
    Mainmessage.findById(req.params.message_id, function(err, message){
        if(err){
            req.flash('error', "Cannot find Messages!");
            res.redirect("/knowledge");
        }
        var newComment = {creator: req.user, comment: req.body.comment};
        Replymessage.create(newComment, function(err, newReplyMessage){
           if(err){
               req.flash('error', "We Cannot Add Your Comment!");
               res.redirect("/knowledge/" + req.params.productName + "/" + req.params.messageType + "/" + req.params.message_id);
           } else {
               message.replies.push(newReplyMessage);
               message.save();
               res.redirect("/knowledge/" + req.params.productName + "/" + req.params.messageType + "/" + req.params.message_id);
           }
        });     
    });
});

module.exports = router;