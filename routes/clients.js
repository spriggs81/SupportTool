var express         = require("express");
var router          = express.Router({mergeParams: true});
var Client          = require("../models/client");
var middleware      = require("../middleware");
var moment          = require("moment");
var Dbclientstatus  = require("../models/dbclientstatus");
var Dbsupportplan   = require("../models/dbsupportplan");
var Dbvpnaccess     = require("../models/dbvpnaccess");

//Index page shows all clients
router.get("/", middleware.isLoggedIn, function(req, res){   
    Client.find().sort({name:1}).exec(function(err, allClients){
        if(err){
            console.log(err);
            req.flash('error', 'We cannot find any Clients!!!');
            res.redirect("/");
        } else {
            res.render("clients/index", {clients: allClients});
        }
    });
});

//New Client Form
router.get("/new", middleware.checkIsAdmin, function(req, res){
    Dbclientstatus.find({}).sort({'keyname': 1}).exec(function(err, foundClientStatuses){
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            Dbsupportplan.find({}).sort({'keyname': 1}).exec(function(err, foundPlans){
                if(err){
                    console.log(err);
                    req.flash('error', 'please report to an admin!');
                    res.redirect('/');
                } else {
                    Dbvpnaccess.find({}).sort({'keyname': 1}).exec(function(err, foundAccesses){
                        if(err){
                            console.log(err);
                            req.flash('error', 'please report to an admin!');
                            res.redirect('/');
                        } else {
                            res.render("clients/new", {statuses: foundClientStatuses, plans: foundPlans, accesses: foundAccesses});
                        }
                    });
                }
            });
        }
    });
});

//Creates New Client
router.post("/", middleware.checkIsAdmin, function(req, res){
    req.body.client.clientit = req.sanitize(req.body.client.clientit);
    req.body.client.connect = req.sanitize(req.body.client.connect);
    var client = req.body.client;
    Client.create(client, function(err, newClient){
        if(err){
            req.flash('error', "Oh No, Something Went Wrong Creating the Client!!!");
            res.redirect("/clients/new");
        }
        else {
            req.flash('success', req.body.client.name+" has been added to the System!");
            res.redirect("/clients/"+newClient.id);
        }
    }); 
});

//client show page
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient){
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            var dateinfo = foundClient.timezone.toString();
            var data1 = dateinfo[4]+dateinfo[5]+dateinfo[6]+dateinfo[7]+dateinfo[8]+dateinfo[9];
            var date1 = moment().utcOffset(data1).format("MMMM Do YYYY - h:mm:ss a - ddd");
            var date2 = moment().utcOffset(data1).add(1,'h').format("MMMM Do YYYY - h:mm:ss a - ddd");
            var test;
            res.render("clients/show", {client: foundClient, date1: date1, date2: date2, test: test});
        }
    });
});

//Client Edit Form Route
router.get("/:id/edit", middleware.checkIsAdmin, function(req, res) {
    Client.findById(req.params.id, function(err, foundClient){
        if(err){
            req.flash('error', "Cannot find the Client!!! Please Try Again");
            res.redirect("/clients");
        } else {
            Dbclientstatus.find({}).sort({'keyname': 1}).exec(function(err, foundClientStatuses){
                if(err){
                    console.log(err);
                    req.flash('error', 'please report to an admin!');
                    res.redirect('/');
                } else {
                    Dbsupportplan.find({}).sort({'keyname': 1}).exec(function(err, foundPlans){
                        if(err){
                            console.log(err);
                            req.flash('error', 'please report to an admin!');
                            res.redirect('/');
                        } else {
                            Dbvpnaccess.find({}).sort({'keyname': 1}).exec(function(err, foundAccesses){
                                if(err){
                                    console.log(err);
                                    req.flash('error', 'please report to an admin!');
                                    res.redirect('/');
                                } else {
                                    res.render("clients/edit", {client: foundClient, statuses: foundClientStatuses, plans: foundPlans, accesses: foundAccesses});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//Client Edit Update Route
router.put("/:id", middleware.checkIsAdmin, function(req, res) {
    req.body.client.clientit = req.sanitize(req.body.client.clientit);
    req.body.client.connect = req.sanitize(req.body.client.connect);
    var client = req.body.client;
    Client.findByIdAndUpdate(req.params.id, client, function(err, updatedClient){
        if(err){
            console.log(err);
            req.flash('error', "We were not able to Update the Client, please try again!!!");
            res.redirect("/clients/" + req.params.id + "/edit");
        } else {
            req.flash('success', "This Client has been Updated!!!");
            res.redirect("/clients/" + updatedClient._id);
        }
    });
});

//client delete route
router.delete("/:id", middleware.checkIsAdmin, function(req, res){
    Client.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash('error',"There was an error removing this Client, please try again!!!");
            res.redirect("/clients/"+req.params.id);
        } else {
            req.flash('success', "We have removed the reqested Client!!!");
            res.redirect("/clients");
        }
    });
});

module.exports = router;