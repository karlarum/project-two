const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const exphbs = require('express-handlebars');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./db/passport')(passport);

const port = process.env.PORT || 3000;
const app = express();

// Connect to the database
// const db = require('./models');
// db.mongoose
//   .connect(db.url)
//   .then(() => {
//     console.log("DB Connected");
//   })
//   .catch((err) => {
//     console.log('Cannot connect to the database!', err);
//     process.exit();
//   });

const connectDB = require('./db/connect');

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Body parser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Access-Control and static file setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware for form submissions
app.use(
  methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars setup with helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Sessions middleware for user authentication persistence
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable for user
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/observations', require('./routes/observations'));

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}.`);
});
