var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name : String,
    img : String,
    price : Number,
    desc : String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
        }
    ],
    created : {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Product", productSchema);