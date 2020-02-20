var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// We can add more data to it
// instead of variables we are essentialy creating objects
var GameSchema = new Schema({
    title:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    user:{
        type:String,
        required:true
    }    
});

// Creates the model games with GameSchema as its schema
mongoose.model('games', GameSchema);