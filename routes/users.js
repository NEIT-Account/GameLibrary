const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

require('../models/User');
var User = mongoose.model('users');

// Routes for Sign in
router.get('/login',(req, res)=>{
    res.send("users/login");
});

router.get('/register',(req, res)=>{
    res.send("users/register");
});

// post
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect:'/game/games', 
        failureRedirect:'users/login',
        failureFlash : true
    })(req, res, next);
})

router.post('/register',(req,res)=>{
    var errors = [];
    if(req.body.password != req.body.password2){
        error.push({
            text:"Passwords Do Not Match"
        });
    }
    if(req.body.password.Length < 4){
        error.push({
            text:"Passwords needs to be greater than 4 characters"
        });
    }
    if(errors.Length > 0){
        res.render('/users/register', {
            errors: errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
        });
    }else{
        var newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
    }

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err)throw err;
            newUser.password = hash;
            newUser.save().then((user)=>{
                res.redirect('/users/login')
            }).catch((err)=>{
                console.log(err);
                return;
            });
        });
    });
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You successfully logged out');
    res.redirect('users/login');
});

module.exports = router;