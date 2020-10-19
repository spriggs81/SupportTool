const express         = require("express"),
      router          = express.Router({mergeParams: true}),
      Mainmessage     = require("../models/mainmessage"),
      Replymessage    = require("../models/replymessage"),
      Dbproduct       = require("../models/dbproduct"),
      middleware      = require("../middleware");

//Landing Route
router.get("/", middleware.isLoggedIn, (req, res) => {
    Dbproduct.find({}).sort({'keyname': 1}).exec((err, allproducts) => {
        if(err){
            console.log(err);
            req.flash('error', "Error looking for DB Productd");
            res.redirect('/');
        } else {
            Mainmessage.find({type: "info"}, (err, infoMessages) => {
                if(err) {
                   req.flash('error', err.message);
                   res.redirect("back");
                } else {
                    Mainmessage.find({type: "questions"}, (err, questionsMessages) => {
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
router.get("/:productName", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.productName, (err, foundproduct) => {
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
router.get("/:productName/info", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.productName, (err, foundproduct) => {
        if(err){
            req.flash('error', "This Product Was Not Found!");
            res.redirect("/knowledge");
        } else {
            Mainmessage.find({product: foundproduct._id, type: "info"}, (err, foundInfoMessages) => {
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
router.get("/:productName/questions", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.productName, (err, foundproduct) => {
        if(err){
            req.flash('error', "This Product Was Not Found!");
            res.redirect("/knowledge");
        } else {
            Mainmessage.find({product: foundproduct._id, type: "questions"}, (err, foundInfoMessages) => {
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
router.get("/:dbproduct_id/info/new", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.dbproduct_id, (err, foundproduct) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            res.render("knowledge/new_info", {product: foundproduct, messageType: req.params.messageType});
        }
    });
});


//Question New Form Route
router.get("/:dbproduct_id/questions/new", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.dbproduct_id, (err, foundproduct) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            res.render("knowledge/new_question", {product: foundproduct, messageType: req.params.messageType});
        }
    });
});


//New Route
router.post("/:productName/:messageType/new", middleware.isLoggedIn, (req, res) => {
    var product = req.params.productName;
    var type = req.params.messageType;
    var creator = req.user;
    var desc = req.sanitize(req.body.desc);
    var message = req.sanitize(req.body.message);
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
router.get("/:productName/:messageType/:message_id", middleware.isLoggedIn, (req, res) => {
    Dbproduct.findById(req.params.productName, (err, foundproduct) => {
        if(err){
            req.flash('error', err.message);
            res.redirect("/knowledge/"+req.params.messageType);
        } else {
            Mainmessage.findById(req.params.message_id).populate("replies").exec((err, message) => {
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
router.get("/:dbproduct_id/info/:message_id/edit", middleware.checkMessageOwnership, (req, res) => {
    Dbproduct.findById(req.params.dbproduct_id, (err, foundproduct) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            Mainmessage.findById(req.params.message_id, (err, foundmessage) => {
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
router.put("/:dbproduct_id/info/:message_id/edit", middleware.checkMessageOwnership, (req, res) => {
    var desc = req.sanitize(req.body.desc);
    var message = req.sanitize(req.body.message);
    Mainmessage.findByIdAndUpdate(req.params.message_id, {desc:desc, message:message}, (err, updatedMessage) => {
       if(err){
           req.flash('error', "We Cannot Add This New Message to Knowledge Base!");
           res.redirect("/knowledge/" + req.params.messageType);
       } else {
           req.flash('success', "This Message has been Updated in the Knowledge Base!");
           res.redirect("/knowledge/" + updatedMessage.product + "/info/" + updatedMessage._id);
       }
    });
});


//Questions edit page route
router.get("/:dbproduct_id/questions/:message_id/edit", middleware.checkMessageOwnership, (req, res) => {
    Dbproduct.findById(req.params.dbproduct_id, (err, foundproduct) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/knowledge');
        } else {
            Mainmessage.findById(req.params.message_id, (err, foundmessage) => {
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
router.put("/:dbproduct_id/questions/:message_id/edit", middleware.checkMessageOwnership, (req, res) => {;
    var desc = req.sanitize(req.body.desc);
    var message = req.sanitize(req.body.message);
    Mainmessage.findByIdAndUpdate(req.params.message_id, {desc:desc, message:message}, (err, updatedMessage) => {
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
router.delete("/:dbproduct_id/:messageType/:message_id/delete", middleware.checkMessageOwnership, (req, res) => {
    Mainmessage.findByIdAndRemove(req.params.message_id, (err) => {
        if(err){
            console.log(err);
        } else {
            req.flash('success', "This has been deleted");
            res.redirect("/knowledge/" + req.params.dbproduct_id + "/" + req.params.messageType);
        }
    });
});

//Post comment Route
router.post("/:productName/:messageType/:message_id/comment", middleware.isLoggedIn, (req, res) => {
    var creator = req.user;
    var comment = req.sanitize(req.body.comment);
    Mainmessage.findById(req.params.message_id, (err, message) => {
        if(err){
            req.flash('error', "Cannot find Messages!");
            res.redirect("/knowledge");
        }
        var newComment = {creator: creator, comment: comment};
        Replymessage.create(newComment, (err, newReplyMessage) => {
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
router.get("/:productName/:messageType/:message_id/comment/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Mainmessage.findById(req.params.message_id, (err, foundmessage) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('/knowledge' + req.params.productName + "/" + req.params.messageType + "/" + req.params.message_id);
        } else {
            Replymessage.findById(req.params.comment_id, (err, foundcomment) => {
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
router.put("/:dbproduct_id/:messageType/:message_id/comment/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    var message = req.sanitize(req.body.comment);
    Replymessage.findByIdAndUpdate(req.params.comment_id, {comment:message}, (err, updatedMessage) => {
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
router.delete("/:dbproduct_id/:messageType/:message_id/comment/:comment_id/delete", middleware.checkCommentOwnership, (req, res) => {
    Replymessage.findByIdAndRemove(req.params.comment_id, (err) => {
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
