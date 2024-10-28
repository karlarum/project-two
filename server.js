const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connect');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

app
  .use(bodyParser.json())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

app.use('/', routes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log('Web Server is listening at port ' + (process.env.PORT || port));
    });
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });