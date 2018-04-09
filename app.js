var express               = require("express"),
    app                   = express(),
    methodOverride        = require("method-override"),
    bodyParser            = require("body-parser"),
    expressSanitizer      = require("express-sanitizer"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Product               = require("./models/product"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    seedDB                = require("./seed");

// ALL ROUTES PATH
var indexRoutes   = require("./routes/index.js");
var productRoutes = require("./routes/products.js");
var commentRoutes = require("./routes/comments.js");

// var jade = require("jade");  /// like emmit but way better then that

//======== mongo connect to database ==========

//mongoose.connect("mongoDB://localhost/rent-data");
mongoose.connect("mongodb://parth:darepirat@ds257808.mlab.com:57808/rentservice");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method")); // for PUT and DELETE req.

//app.engine('ejs', require('ejs').renderFile);
//seedDB();  // SEED DATABASE

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "are we in simulation???",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//var Prods = Product.find({}, function(err, product){
//    if(err){
//        console.log(err);
//    }else{
//        return product;
//    }
//});

// for showing search result in search bar 
var productNames = [];
Product.find({}, function(err, allProducts){
    if(err){
        console.log(err);
        next();
    }else{
        allProducts.forEach(function(product){
            productNames.push(product.name);
        });
    }
});

//// ===== MIDDLEWARE FOR CHACKING IF LOGGED IN OR NOT =====
app.use(function(req, res, next){
    res.locals.req          = req;
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.productNames = productNames;
    next();
});

// REQUIREING ROUTES
app.use(indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);

app.get("/rent-service/about/terms", function(req, res){
    res.render("about/terms");
});

// DEFAULT ROUTE
app.get("*", function(req, res){
    res.send("Page not available! please visit home page!");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!!!");
});

// app.listen(9000, function(){
//    console.log("server Started!!!")
// });