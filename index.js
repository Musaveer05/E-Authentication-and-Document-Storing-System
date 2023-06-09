if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoStore = require('connect-mongo')
const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // 1 minute timeout
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
console.log("The dbUrl is ", dbUrl);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(mongoSanitize());

const secret = process.env.SECRET;
console.log("secret is", secret);

const store = mongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 10 * 60 
})

store.on('error', function(e){
    console.log('session store error', e);
})

const sessionConfig = {
    store,
    name:'session',
    secret, 
    resave: false, 
    saveUninitialized: false, 
    cookie:{
        httpOnly:true,
        secure:true,
        maxAge:10 * 60 * 1000  
    }
}

console.log("session Config is ",sessionConfig);

app.use(session(sessionConfig));
app.use(flash());


app.use('/register', require('./router/register'));
app.use('/verifyOtp', require('./router/verifyOtp'));
app.use('/login', require('./router/login'));
app.use('/UserProfile', require('./router/UserProfile'));
app.use('/UserProfile/UploadDocuments', require('./router/uploadDocuments'));
app.use('/UserProfile/viewDocuments', require('./router/viewDocuments'));
app.use('/delete-image', require('./router/deleteImages'));
app.use('/download-image', require('./router/downloadPdf'));

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

