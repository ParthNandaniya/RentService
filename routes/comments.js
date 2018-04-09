var express    = require("express"),
    router     = express.Router({mergeParams: true}),//otherwise req.params.id not found
    Product    = require("../models/product"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware/"); // if we don't specify, it will automatically look for index.js

////////////////////////
// COMMENT ROUTE
///////////////////////
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
             res.render("comments/new", {product: product});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id).populate("comments").exec(function(err, product){
        if(err){
            console.log(err);
            req.flash("error", "something went wrong!, please try again!");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("err in /products/:id/comments GET ROUTE");
                    console.log(err);
                    req.flash("error", "can't add comment at this point, please try again!!!");
                    res.redirect("back");
                } else {
                    // add comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save it to the database
                    comment.save();
                    // push comment to product
                    product.comments.push(comment);
                    // save product
                    product.save();
                    req.flash("success", "comment created :)");
                    res.redirect('/products/' + product._id);
                }
            });
        }
    });
});

// UPDATE COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
            req.flash("error", "something went wrong, please try again!!!");
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    console.log("err in comments/edit page ==========");
                    console.log(err);
                    req.flash("error", "something went wrong, please try again!!!");
                    return res.redirect("back");
                }else{
                    res.render("comments/edit", {product: product, comment: comment});
                }
            });
        }
    });
//    Comment.findById(req.params.comment_id, function(err, comment){
//       if(err){
//           console.log(err);
//       } else{
//           res.render("comments/edit", {product_id: req.params.id, comment: comment});
//       }
//    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          console.log(err);
          req.flash("error", "can't update comment at this point, please try again!!!");
          res.redirect("back");
      } else {
          req.flash("success", "comment updated :)");
          res.redirect("/products/" + req.params.id );
      }
   });
});

// COMMENT DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
            req.flash("error", "something went wrong, please try again!!!");
            res.redirect("back");
        }else{
            req.flash("success", "comment deleted :)")
            res.redirect("/products/" + req.params.id);
        }
    });
});

// =====================
// =====  RUBBISH  ======
// =====================

//router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
//    Product.findById(req.params.id).populate("comments").exec(function(err, product){
//       if(err) {
//           console.log(err);
//       }else{
//            Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, {new: true}, function(err, updatedComment){
////                console.log(updatedComment);
////                console.log(product.comments[2]);
//                console.log("===============");
//                if(err){
//                    console.log(err);
//                }else{
//                    product.comments.forEach(function(comment){
//                       if(comment._id.equals(updatedComment._id)){
//                            comment = updatedComment;
//                            console.log(comment);
//                            comment.save();
//                            product.save();
//                            console.log(product);
//                       };
//                    });
//                    res.redirect("/products/" + req.params.id);
//                }
//            });

//    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
//        if(err){
//            res.redirect("back");
//        }else{
//            res.redirect("/products/" + req.params.id);
//        }
//    });

//    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
//        if(err){
//           console.log(err);
//        }else{
//            Product.findById(req.params.id).populate("comments").exec(function(err, product){
//                if(err) {
//                    console.log(err);
//                }else{
//                    product.comments.forEach(function(comment){
//                        if(updatedComment._id.equals(comment._id)){
//                            console.log("===============");
//                            comment = updatedComment;
//                            console.log(comment);
//                            console.log(updatedComment);
//                            comment.save();
//                            product.save();
//                        }
//                    });
//                    res.redirect("/products/" + product._id);
//                }
//            });
//        }
//    });
//});


module.exports = router;