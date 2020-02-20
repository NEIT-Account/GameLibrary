const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
var {ensureAuthenticated} = require('../helper/auth');

require('../models/Game');
var Game = mongoose.model('games');

// Game Entry Crud routes
router.get('/games', ensureAuthenticated, (req, res) => {
    Game.find({user: req.user.id}).then((games) => {

        res.render('gameentry/index', {
            games: games
        });
    });
});

router.get('/gameentry/add', ensureAuthenticated, (req, res) => {
    res.render('gameentry/add');
});

router.get('/gameentry/edit/:id', ensureAuthenticated, (req, res) => {
    Game.findOne({
        _id: req.params.id
    }).then((game) => {
        if (game.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/game/games')
        } else {
            res.render('gameentry/edit', {
                game: game
            });
        }
    })
});

router.post("/gameentry", ensureAuthenticated,(req, res) => {
    //console.log(req.body);
    var errors = [];
    if (!req.body.title) {
        errors.push({ text: 'please add a title!' });
    }
    if (!req.body.price) {
        errors.push({ text: 'please add a price!' });
    }
    if (!req.body.description) {
        errors.push({ text: 'please add a description!' });
    }

    if (errors.length > 0) {
        res.render('gameentry/add', {
            errors: errors,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description
        });
    } else {
        // res.send(req.body);
        var newUser = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            user: req.user.id
        };

        Game(newUser).save().then(() => {
            req.flash('success_msg', 'Game Added Successfully');
            res.redirect('/game/games');
        });
    }
    //res.send("Game Posted");
});

router.put('/gameedit/:id', ensureAuthenticated, (req, res) => {
    Game.findOne({
        _id: req.params.id
    }).then((game) => {
        game.title = req.body.title
        game.price = req.body.price
        game.description = req.body.description

        game.save().then((game) => {
            req.flash('success_msg', 'Game Edited Successfully');
            res.redirect("/games")
        })
    })
})

router.delete('/gamedelete/:id', ensureAuthenticated, (req, res) => {
    Game.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Game Deleted Successfully');
        res.redirect('/games');
    });
});

module.exports = router;