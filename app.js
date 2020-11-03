const bodyParser       = require("body-parser"),
      expressSanitizer = require("express-sanitizer"),
      methodOverride   = require("method-override"),
      mongoose         = require("mongoose"),
      express          = require("express"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      flash            = require("connect-flash"),
      User             = require("./models/user"),
      //seedDB           = require("./seeds"),
      app              = express();


//requiring routes
const homeRoute               = require("./routes/home"),
      clientRoutes            = require("./routes/clients"),
      productRoutes           = require("./routes/products"),
      serverRoutes            = require("./routes/servers"),
      adminRoutes             = require("./routes/admin"),
      db_ProductRoutes        = require("./routes/db_product"),
      db_ClientstatusRoutes   = require("./routes/db_clientstatus"),
      db_SupportplanRoutes    = require("./routes/db_supportplan"),
      db_Managements          = require("./routes/db_management"),
      db_VpnaccessRoutes      = require("./routes/db_vpnaccess"),
      db_Department           = require("./routes/db_department"),
      adminUserRoutes         = require("./routes/admin_user"),
      indexRoutes             = require("./routes/index"),
      knowledgeRoutes         = require("./routes/knowledge");

const databaseurl = typeof(process.env.DATABASEURL) == 'string' && process.env.DATABASEURL.length > 0 ? process.env.DATABASEURL : "mongodb://localhost:27017/support_tools_v4";
const port = typeof(Number(process.env.PORT)) == 'number' && process.env.PORT != null ? process.env.PORT : 3000;
const ip = typeof(process.env.IP) == 'string' && process.env.IP.length > 0 ? process.env.IP : "localhost";

console.log("databaseurl: ",databaseurl,"\nport: ",port,"\nip: ",ip);

//setup MongoDB
mongoose.connect(databaseurl, (err) => {
    if(!err){
        console.log("MongoDB Connection Successful!");
    } else {
        console.log("Error in DB Connection : " + JSON.stringify(err, undefined, 2));
    }
});

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


//Passport config
app.use(require("express-session")({
    secret: "Support Is Online",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // res.locals.settings = req.user.settings;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//using routes
app.use("/", indexRoutes);
app.use("/home", homeRoute);
app.use("/admin", adminRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/db", db_ProductRoutes);
app.use("/admin/db", db_ClientstatusRoutes);
app.use("/admin/db", db_SupportplanRoutes);
app.use("/admin/db", db_VpnaccessRoutes);
app.use("/admin/db", db_Managements);
app.use("/admin/db", db_Department);
app.use("/clients", clientRoutes);
app.use("/clients/:id/products", productRoutes);
app.use("/clients/:id/servers", serverRoutes);
app.use("/knowledge", knowledgeRoutes);


app.listen(port, ip, () => {
    console.log("Support Tool Is Online!");
});
