const express = require('express');
const expressHB = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const db = require('./helper/database');

var port = process.env.PORT || 5000;
const app = express();
const success = 'success_msg';
const failure = 'error_msg';
const error = 'error';

// load routes
var games = require('./routes/games');
var users = require('./routes/users');

// load passport
require('./config/passport')(passport);

// mongoose connection
mongoose.connect(db.mongoURI,
{
    useUnifiedTopology:true,
    useNewUrlParser:true    
}).then(()=>{
        console.log("MongoDB Connected");
    }).catch((err)=>{
        console.log(err);
    });

require('./models/Game');
var Game = mongoose.model('games');


app.engine('handlebars', expressHB({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// set up for session
app.use(session({
    secret:"poop",
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize())
app.use(passport.session())

// set up for flash messaging
app.use(flash());
// flash global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash(success);
    res.locals.error_msg = req.flash(failure);
    res.locals.error = req.flash(error);
    res.locals.user = req.user || null;
    next();
});

app.use(methodOverride('_method'));

app.use( bodyParser.json());
app.use( bodyParser.urlencoded({extended:false}));




app.get('/', (req, res)=>{
    var title = "Welcome to the Game Library";
    res.render('home', {title:title});
});

app.get('/about', (req, res)=>{
    res.render('about');
});

// Use our routes
app.use('/game', games);
app.use('/users', users);

//Server Connections
app.listen(port, ()=>{
    console.log('server running on port ' + port);
});