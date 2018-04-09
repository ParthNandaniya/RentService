var Product       = require("../models/product"),
    Comment       = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkProductOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Product.findById(req.params.id, function(err, foundProduct){
            if(err){
                console.log(err);
                req.flash("error", "Something went Wrong, please try again!!!");
                res.redirect("/products/" + req.params.id);
            }else{
                if(foundProduct.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you don't have permission to do that");
                    res.redirect("/products/" + req.params.id);
                }
            }
        });
    }else{
        req.flash("error", "you need to be logged in to do that!!!");
        res.redirect("/products/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                req.flash("error", "something went wrong, please try again!!!");
                res.redirect("/products/" + req.params.id);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you don't have permission to do that");
                    res.redirect("/products/" + req.params.id);
                }
            }
        });
    }else{
        req.flash("error", "you need to be logged in to do that!!!");
        res.redirect("/products/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you need to be logged in to do that!!!");
    res.redirect("/login");
};

module.exports = middlewareObj;
