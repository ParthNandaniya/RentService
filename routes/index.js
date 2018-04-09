var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    Product    = require("../models/product"),
    Comment    = require("../models/comment"),
    User       = require("../models/user");

// LANDING PAGE
router.get("/",function(req, res){
   res.redirect("/products");
});  

///*********************
// AUTH Routes
///*********************
// REGISTRATION ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User(
        {
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            username: req.body.username,
            terms: req.body.terms
        }
    );
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Rent Service, " + user.username + " :) ");
            res.redirect("/products");
        });
    });
});

// LOGIN ROUTE
router.get("/login", function(req, res){
   res.render("login");
});

// app.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/products",
        failureRedirect: "/login"
    }), function(req, res){
    // nothing to do anything, we done it in middleware
    }
);

// LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logOut();
   req.flash("success", "Successfully Logged you out!!!");
   res.redirect("/products");
});

module.exports = router;
