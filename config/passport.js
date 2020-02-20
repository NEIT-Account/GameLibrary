const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const passport = require('passport')

const user = mongoose.model('users')

module.exports = (passport)=>{
    passport.use(new localStrategy({usernameField:'email'}, (email, password, done)=>{
        console.log(email)
        console.log(password)
        User.findOne({email:email})
            .then((user)=>{
                if(!user) return done(null, false, {message:"No User Found" });

                bCrypt.compare(password, user.password, (err, isMatch)=>{
                  if(err) throw err;
                  if(isMatch) return done(null, user);
                  else return done(null, false, {message:"Password is Incorrect"})  
                })
            })
    }))
    var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
}