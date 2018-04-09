var mongooose = require("mongoose"),
    Product   = require("./models/product"),
    Comment   = require("./models/comment");
//var data = [
//    {
//        name : "futurastic bike",
//        img : "https://i.ytimg.com/vi/Q6xybdaV3xs/maxresdefault.jpg",
//        price : "900",
//        desc : "blah blah blah"
//    }
//    {
//        name : "Gear petrol",
//        img : "https://cdn.gearpatrol.com/wp-content/uploads/2017/10/Get-Your-Very-Own-Custom-Designed-and-Tailored-Motorcycle-Jacket-For-700-gear-patrol-full-lead.jpg",
//        price : "900",
//        desc : "blah blah blah"
//    },
//    {
//        name : "bikeDekho",
//        img : "https://bd.gaadicdn.com/processedimages/tvs/tvs-akula-310/371X252/v_akula-310-abs.jpg",
//        price : "900",
//        desc : "blah blah blah"
//    }
//];

function seedDB(){
   //Remove all campgrounds
   Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed products!");
         //add a few campgrounds
//        data.forEach(function(seed){
//            Product.create(seed, function(err, product){
//                if(err){
//                    console.log(err);
//                } else {
//                    console.log("added a product");
//                    // create a comment
//                    Comment.create(
//                        {
//                            text: "this is outside of my mind",
//                            author: "colon"
//                        }, function(err, comment){
//                            if(err){
//                                console.log(err);
//                            } else {
//                                product.comments.push(comment);
//                                product.save();
//                                console.log("Created new comment");
//                            }
//                        });
//                }
//            });
//       });
    }); 
    //add a few comments
}

module.exports = seedDB;