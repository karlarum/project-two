const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

require('./db/passport')(passport);

// Connect to MongoDB
const connectDB = require('./db/connect');
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes/dashboard'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/observations', require('./routes/observation'));

// Start server
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}.`);
});