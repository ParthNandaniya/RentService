var express    = require("express"),
    router     = express.Router(),
    Product    = require("../models/product"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware/"); // if we don't specify, it will automatically look for index.js


// ==================
// PRODUCTS ROUTE
// ==================

// SHOW ALL PRODUCTS
router.get("/", function(req, res){
    
    // it will only shows that matches with regexp condition
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({"name": regex}, function(err, allProducts){
            if(err){
                console.log("err in /products");
                console.log(err);
                req.flash("error", "Something went wrong, please try again!!!");
                res.redirect("/products");
            }else{
                if(allProducts.length < 1){
                    req.flash("error", "couldn't find any product, Please try something else...");
                    res.redirect("/products");   
                }else{
                    res.render("products/index", {products : allProducts});    
                }
            }
       });
    }else{
        Product.find({}, function(err, allProducts){
        if(err){
            console.log("err in /products");
            console.log(err);
            res.redirect("/products");
        }else{
            res.render("products/index", {products : allProducts});
        }
        });
    }
});

// NEW PRODUCT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("products/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
    req.body.product.desc = req.sanitize(req.body.product.desc); //sanitize can't take javascript in html
    var name = req.body.product.name;
    var img  = req.body.product.img;
    var price = req.body.product.price;
    var desc = req.body.product.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var p = [{name: name, img: img, price: price, desc: desc, author: author}];
   // Product.create(req.body.product, function(err, newProduct){
    Product.create(p, function(err, newProduct){
        if(err){
            console.log(err);
            req.flash("error", "can't add product at this point, please try again!!!");
            res.redirect("/products");
        }else{
            res.redirect("/products");
        }
    });
});

// SHOW PRODUCT DETAIL ROUTE
router.get("/:id", function(req, res){
    Product.findById(req.params.id).populate("comments").exec(function(err, product){
        if(err){
            console.log("err in products/:id");
            console.log(err);
            req.flash("error", "something went wrong, please try again!!!");
            res.redirect("/products");
        }else{
            res.render("products/product-detail",{product : product});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log("err in products/:id/edit");
            console.log(err);
            req.flash("error", "something went wrong, please try again!!!");
            res.redirect("/products");
        }else{
            res.render("products/edit", {product: foundProduct});
        }
    });
});

// UPDATE DATA TO DATABASE
router.put("/:id", middleware.checkProductOwnership, function(req, res){
    req.body.product.desc = req.sanitize(req.body.product.desc);
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err) {
           console.log("err in /products/:id put req");
           console.log(err);
           req.flash("error", "can't update product at this point, please try again!!!");
           res.redirect("/products/" + req.params.id);
       }else{
           res.redirect("/products/" + req.params.id);
       }
    });
});

// DELETE DATA FROM DATABASE
router.delete("/:id", middleware.checkProductOwnership, function(req, res){
   Product.findByIdAndRemove(req.params.id, function(err, data){
      if(err) {
          console.log("err from /products/:id delete req");
          console.log(err);
          req.flash("error", "somwthing went wrong!, please try again ");
          res.redirect("/products");
      }else{
          res.redirect("/products");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;