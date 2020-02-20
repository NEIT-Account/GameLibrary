var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },    
    date:{
        type:Date,
        default:Date.now
    }    
});

// Creates the model games with GameSchema as its schema
mongoose.model('users', UserSchema);