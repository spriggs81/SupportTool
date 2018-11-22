var express         = require("express");
var router          = express.Router({mergeParams: true})
var Mainmessage     = require("../models/mainmessage");
var Replymessage    = require("../models/replymessage");
var Dbproduct       = require("../models/dbproduct");
var middleware      = require("../middleware");

//Landing Route
router.get("/", middleware.isLoggedIn, function(req, res) {
    Dbproduct.find({}, function(err, allproducts) {
        if(err){
            console.log(err);
            req.flash('error', "Error looking for DB Productd");
            res.redirect('/');
        } else {
            Mainmessage.find({type: "info"}, function(err, infoMessages){
                if(err) {
                   req.flash('error', err.message);
                   res.redirect("back");
                } else {
                    Mainmessage.find({type: "questions"}, function(err, questionsMessages) {
                       if(err){
                           req.flash('error', err.message);
                           res.redirect("back");
                        } else {
                           res.render("knowledge/landing", {products:allproducts, allinfo:infoMessages, allquestions:questionsMessages});
                        }
                   });
                }     
            });
        }    
    });
});

//Product Waiting Route
router.get("/:productName", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.productName, function(err, foundproduct){
        if(err){
            console.log(err);
            req.flash('error', "This Product Was Not Found!");
            res.redirect("/knowledge");
        } else {
            res.render("knowledge/pickOne", {product: foundproduct});
        }        
    });
});


//Product Info Route
router.get("/:productName/info", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.productName, function(err, foundproduct){
        if(err){
            req.flash('error', "This Product Was Not Found!");
            res.redirect("/knowledge");
        } else {
            Mainmessage.find({product: foundproduct._id, type: "info"}, function(err, foundInfoMessages){
               if(err){
                    console.log(err);
                    req.flash('error',"There was a problem locating the information you were looking for.  Please let an Admin know.");
                    res.redirect("back");
               } else {
                    res.render("knowledge/index_info", {product:foundproduct, messages: foundInfoMessages});   
               }
            });
        }        
    });
});


//Product Question Route
router.get("/:productName/questions", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.productName, function(err, foundproduct){
        if(err){
            req.flash('error', "This Product Was Not Found!");
            res.redirect("/knowledge");
        } else {
            Mainmessage.find({product: foundproduct._id, type: "questions"}, function(err, foundInfoMessages){
               if(err){
                    console.log(err);
                    req.flash('error',"There was a problem locating the information you were looking for.  Please let an Admin know.");
                    res.redirect("back");
               } else {
                    res.render("knowledge/index_question", {product:foundproduct, messages: foundInfoMessages});   
               }
            });
        }        
    });
});


//Info New Form Route
router.get("/:dbproduct_id/info/new", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.dbproduct_id, function(err, foundproduct) {
        if(err){
            console.log(req.params.dbproduct_id);
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            res.render("knowledge/new_info", {product: foundproduct, messageType: req.params.messageType});
        }
    });
});


//Question New Form Route
router.get("/:dbproduct_id/questions/new", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.dbproduct_id, function(err, foundproduct) {
        if(err){
            console.log(req.params.dbproduct_id);
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            res.render("knowledge/new_question", {product: foundproduct, messageType: req.params.messageType});
        }
    });
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
           console.log(err);
           req.flash('error', "We Cannot Add This New Message to Knowledge Base!");
           res.redirect("/knowledge/" + req.params.messageType);
       } else {
           req.flash('success', "This New Message has been Added to Knowledge Base!");
           res.redirect("/knowledge/" + req.params.productName + "/" + req.params.messageType);
       }
    });
});


//show Route
router.get("/:productName/:messageType/:message_id", middleware.isLoggedIn, function(req, res) {
    Dbproduct.findById(req.params.productName, function(err, foundproduct) {
        if(err){
            req.flash('error', err.message);
            res.redirect("/knowledge/"+req.params.messageType);
        } else {
            Mainmessage.findById(req.params.message_id).populate("replies").exec(function(err, message){
                if(err){
                    req.flash('error', "Cannot find Messages!");
                    console.log(err.message);
                    res.redirect("/knowledge");
                } else {
                    res.render("knowledge/show", {product: foundproduct, message: message});
                }        
            });
        }
    });
});


//info edit page route
router.get("/:dbproduct_id/info/:message_id/edit", middleware.checkMessageOwnership, function(req, res) {
    Dbproduct.findById(req.params.dbproduct_id, function(err, foundproduct) {
        if(err){
            console.log(req.params.dbproduct_id);
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            Mainmessage.findById(req.params.message_id, function(err, foundmessage) {
                if(err){
                    req.flash('error', err.message);
                    res.redirect("back");
                } else {
                    res.render("knowledge/edit_info", {product:foundproduct, message: foundmessage});
                }        
            });
        }
    });
});

//Info Edit Route
router.put("/:dbproduct_id/info/:message_id/edit", middleware.checkMessageOwnership, function(req, res) {
    var desc = req.body.desc;
    var message = req.body.message;
    Mainmessage.findByIdAndUpdate(req.params.message_id, {desc:desc, message:message}, function(err, updatedMessage){
       if(err){
           console.log(err);
           req.flash('error', "We Cannot Add This New Message to Knowledge Base!");
           res.redirect("/knowledge/" + req.params.messageType);
       } else {
           req.flash('success', "This Message has been Updated in the Knowledge Base!");
           res.redirect("/knowledge/" + updatedMessage.product + "/info/" + updatedMessage._id);
       }
    });
});


//Questions edit page route
router.get("/:dbproduct_id/questions/:message_id/edit", middleware.checkMessageOwnership, function(req, res) {
    Dbproduct.findById(req.params.dbproduct_id, function(err, foundproduct) {
        if(err){
            console.log(req.params.dbproduct_id);
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            Mainmessage.findById(req.params.message_id, function(err, foundmessage) {
                if(err){
                    req.flash('error', err.message);
                    res.redirect("back");
                } else {
                    res.render("knowledge/edit_question", {product:foundproduct, message: foundmessage});
                }        
            });
        }
    });
});

//Questions Edit Route
router.put("/:dbproduct_id/questions/:message_id/edit", middleware.checkMessageOwnership, function(req, res) {
    var desc = req.body.desc;
    var message = req.body.message;
    Mainmessage.findByIdAndUpdate(req.params.message_id, {desc:desc, message:message}, function(err, updatedMessage){
       if(err){
           console.log(err);
           req.flash('error', "We Cannot Update This Message in The Knowledge Base!");
           res.redirect("/knowledge/" + req.params.messageType);
       } else {
           req.flash('success', "This Message has been Updated in the Knowledge Base!");
           res.redirect("/knowledge/" + updatedMessage.product + "/questions/" + updatedMessage._id);
       }
    });
});

//Delete info/questions route
router.delete("/:dbproduct_id/:messageType/:message_id/delete", middleware.checkMessageOwnership, function(req, res){
    Mainmessage.findByIdAndRemove(req.params.message_id, function(err){
        if(err){
            console.log(err);
        } else {
            req.flash('success', "This has been deleted");
            res.redirect("/knowledge/" + req.params.dbproduct_id + "/" + req.params.messageType);
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

//Comment edit page route
router.get("/:productName/:messageType/:message_id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Mainmessage.findById(req.params.message_id, function(err, foundmessage) {
        if(err){
            console.log(req.params.dbproduct_id);
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            Replymessage.findById(req.params.comment_id, function(err, foundcomment) {
                if(err){
                    req.flash('error', err.message);
                    res.redirect("back");
                } else {
                    res.render("knowledge/edit_comment", {message:foundmessage, comment: foundcomment});
                }        
            });
        }
    });
});

//Comment Edit Route
router.put("/:dbproduct_id/:messageType/:message_id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    var message = req.body.comment;
    Replymessage.findByIdAndUpdate(req.params.comment_id, {comment:message}, function(err, updatedMessage){
       if(err){
           console.log(err);
           req.flash('error', "We Cannot Update This Comment in The Knowledge Base!");
           res.redirect("/knowledge/" + req.params.messageType);
       } else {
           req.flash('success', "This Comment has been Updated in the Knowledge Base!");
           res.redirect("/knowledge/" + req.params.dbproduct_id + "/" + req.params.messageType + "/" + req.params.message_id);
       }
    });
});

//Delete Comment route
router.delete("/:dbproduct_id/:messageType/:message_id/comment/:comment_id/delete", middleware.checkCommentOwnership, function(req, res){
    Replymessage.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash('error', err.message);
            res.redirect("back");
        } else {
            req.flash('success', "This has been deleted");
            res.redirect("/knowledge/" + req.params.dbproduct_id + "/" + req.params.messageType + "/" + req.params.message_id);
        }
    });
});

module.exports = router;