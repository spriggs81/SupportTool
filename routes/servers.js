const express = require("express"),
      router = express.Router({mergeParams: true}),
      Client = require("../models/client"),
      Appserver = require("../models/appserver"),
      DBserver = require("../models/dbserver"),
      middleware = require("../middleware");


// =========================
//      SERVER ROUTE
// ==========================
//Server Index Page
router.get("/", middleware.isLoggedIn, (req, res) => {
    Client.findById(req.params.id).populate("appservers dbservers").exec((err, foundClient) => {
        if(err){
            req.flash('error', 'We cannot find the Client!!!');
        } else{
            res.render("servers/index",{client: foundClient});
        }
    });
});

// New App Server Form route
router.get("/new/app", middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "Can't find client!!!");
            res.redirect("/clients/:id/server/new");
        } else {
            res.render("servers/newapp", {client: foundClient});
        }
    });
});

// New DB Server Form route
router.get("/new/db", middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "Can't find client!!!");
            res.redirect("/clients/:id/server/new");
        } else {
            res.render("servers/newdb", {client: foundClient});
        }
    });
});

//Add New App Server
router.post("/app", middleware.checkIsAdmin, (req, res) => {
    req.body = req.sanitize(req.body);
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            return res.redirect("/clients/:id/servers/new");
        }
        Appserver.create(req.body.appserver, (err, newAppserver) => {
            if(err){
                req.flash('error', "We cannot create this Server, please try again!!!");
                console.log(JSON.stringify(err));
            } else{
                foundClient.appservers.push(newAppserver);
                foundClient.save();
                req.flash('success', "A New Application Server has been Added to " + foundClient.name);
                res.redirect('/clients/' + foundClient._id +'/servers/new/app');
            }
        });
    });
});


//Add New Database Sever
router.post("/db", middleware.checkIsAdmin, (req, res) => {
    req.body = req.sanitize(req.body);
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            return res.redirect("/clients/:id/servers/new");
        }
        DBserver.create(req.body.appserver, (err, newDBserver) =>{
            if(err){
                req.flash('error', "Error trying to create Database Server.  Please try again!!!");
                console.log(JSON.stringify(err));
            } else{
                foundClient.dbservers.push(newDBserver);
                foundClient.save();
                req.flash('success', "A New Database Server has been Added to " + foundClient.name);
                res.redirect('/clients/' + foundClient._id +'/servers/new/db');
            }
        });
    });
});


//Server Show Page for App server
router.get("/app/:server_id", middleware.isLoggedIn, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            Appserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error', "We cannot find the Server Information!!!");
                    res.redirect("back");
                } else {
                    res.render("servers/showapp", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});


//Server Show Page for DB server
router.get("/db/:server_id", middleware.isLoggedIn, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            DBserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error', "We cannot find the Server Information!!!");
                    res.redirect("back");
                } else {
                    res.render("servers/showdb", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});


//Get App Server Edit Form
router.get('/app/:server_id/edit', middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Appserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error',"We cannot find this Server!");
                    console.log(err);
                    res.redirect("/clients/:id/servers");
                } else {
                    res.render("servers/editapp", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});

//Update route for app server
router.put("/app/:server_id", middleware.checkIsAdmin, (req, res) => {
    req.body = req.sanitize(req.body);
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            Appserver.findByIdAndUpdate(req.params.server_id, req.body.appserver, (err, updatedServer) => {
                if(err){
                    req.flash('error', "We cannot find the Server!!!");
                    req.redirect("/clients/"+foundClient._id+"/servers");
                } else {
                    req.flash('success', "This Server has been Updated!!!");
                    res.redirect("/clients/"+foundClient._id+"/servers/app/"+updatedServer._id);
                }
            });
        }
    });
});

//Get DB Server Edit Form
router.get('/db/:server_id/edit', middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            DBserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error',"We cannot find this Server!");
                    console.log(err);
                    res.redirect("/clients/:id/servers");
                } else {
                    res.render("servers/editdb", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});

//Update route for db server
router.put("/db/:server_id", middleware.checkIsAdmin, (req, res) => {
    req.body = req.sanitize(req.body);
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            DBserver.findByIdAndUpdate(req.params.server_id, req.body.dbserver, (err, updatedServer) => {
                if(err){
                    req.flash('error', "We cannot find the Server!!!");
                    req.redirect("/clients/"+foundClient._id+"/servers");
                } else {
                    req.flash('success', "This Server has been Updated!!!");
                    res.redirect("/clients/" + foundClient._id + "/servers/db/"+updatedServer._id);
                }
            });
        }
    });
});

//delete route for App Server
router.delete("/app/:server_id", middleware.checkIsAdminDelete, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            Appserver.findByIdAndRemove(req.params.server_id, (err) => {
                if(err){
                    req.flash('error', "We could not delete this Server!!!");
                    res.redirect("/clients/" + req.params.id + "/servers");
                }
                req.flash("success", "You have deleted the Server Information from " + foundClient.name);
                res.redirect("/clients/" + req.params.id + "/servers");
            });
        }
    });
});

//delete route for DB Server
router.delete("/db/:server_id", middleware.checkIsAdminDelete, (req, res) => {
    Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else {
            DBserver.findByIdAndRemove(req.params.server_id, (err) => {
                if(err){
                    req.flash('error', "We could not delete this Server!!!");
                    res.redirect("/clients/" + req.params.id + "/servers");
                }
                req.flash("success", "You have deleted the Server Information from" + foundClient.name);
                res.redirect("/clients/" + req.params.id + "/servers");
            });
        }
    });
});

//App Server Menu Reoute
router.get('/app/:server_id/menu', middleware.checkIsAdmin, (req, res) => {
     Client.findById(req.params.id, (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            Appserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error',"We cannot find this Server!");
                    console.log(err);
                    res.redirect("/clients/:id/servers");
                } else {
                    res.render("servers/menuapp", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});

//DB Server Menu Route
router.get('/db/:server_id/menu', middleware.checkIsAdmin, (req, res) => {
    Client.findById(req.params.id,  (err, foundClient) => {
        if(err){
            req.flash('error', "We cannot find the Client!!!");
            res.redirect("/clients");
        } else{
            DBserver.findById(req.params.server_id, (err, foundServer) => {
                if(err){
                    req.flash('error',"We cannot find this Server!");
                    console.log(err);
                    res.redirect("/clients/:id/servers");
                } else {
                    res.render("servers/menudb", {client: foundClient, server: foundServer});
                }
            });
        }
    });
});

module.exports = router;
