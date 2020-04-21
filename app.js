var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	connectDB = require('./DB/Connection'),
	Campground = require('./models/campground'),
	methodOverride = require('method-override'),
	Comment = require('./models/comment'),
	passport = require('passport'),
	LocalStratergy = require('passport-local'),
	User = require('./models/user'),
	seedDB = require('./seeds'),
	flash = require('connect-flash');
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');
const PORT = process.env.PORT || 3000;
connectDB();
// seedDB(); //to seed the database
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash()); //before passport configuration
//PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'Detective',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
	//res.status(404).send('This page does not exist..');
});

app.get('/', (req, res) => {
	res.render('landing');
});
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);
app.use(function(req, res) {
	res.status(404).send('error');
});
app.listen(PORT, () => {
	console.log('Server has Started');
});
