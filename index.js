const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
// const register = require('./router/register');
// const User = require('./models/user');
const session = require('express-session');
// const emailOtpMod = require('./models/userEmailOtp');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/semlast', {
    useNewUrlParser: true,
});

// for verifying mongodb connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

// app.use(express.static(__dirname + '/public'));.
// app.use(express.static('public'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended : true}));
app.use(session({ secret: 'notagoodsecret', resave:false }));
app.use(flash());
app.use('/register', require('./router/register'));
app.use('/login', require('./router/login'));
// app.use('/register/verifyotp', require('./router/register')); eg building more inside the router
app.use('/verifyOtp', require('./router/verifyOtp'));
app.use('/UserProfile', require('./router/UserProfile'));


app.get('/', (req,res) => {
    res.render('Home', {messages: req.flash('Exists')});
})


app.get('/nav/:Elements', (req,res) => {
    var sub = req.params.Elements;
    res.render(`${sub}`, {Elements: sub});
    // res.render("KYC.ejs", {Elements:sub}); // render only that specific navlink
});
// can also do it this way
// app.get('/nav/:Elements', (req,res) => {
//     var {Elements} = req.params;  // This also works
//     res.render(`${Elements}`);
// });

app.get('/uploadDocument', (req,res) =>{
    res.render('UploadDocument');
})


app.listen(8080, () => {
    // console.log(`Listening on port -ok- ${port}`);
    console.log("Listening on port 8080 ");
}) 

