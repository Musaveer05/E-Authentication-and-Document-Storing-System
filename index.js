if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const ejs = require('ejs'); 
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost:27017/semlast', {
    useNewUrlParser: true,
});

// for verifying mongodb connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false, cookie:{maxAge:300000}}));
app.use(flash());


app.use('/register', require('./router/register'));
app.use('/login', require('./router/login'));
app.use('/verifyOtp', require('./router/verifyOtp'));
app.use('/UserProfile', require('./router/UserProfile'));
app.use('/UserProfile/UploadDocuments', require('./router/uploadDocuments'));
app.use('/UserProfile/viewDocuments', require('./router/viewDocuments'));


app.get('/', (req, res) => {
    res.render('Home', { messages: req.flash('Exists') });
})

app.get('/nav/:Elements', (req, res) => {
    let { Elements } = req.params;
    res.render(`navbar/${Elements}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
