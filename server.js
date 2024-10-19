const express = require('express');
const bodyParser = require('body-parser');
const { initDb } = require('./db/connect');
const userRouter = require('./routes/user');
const observationRouter = require('./routes/observation')
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
    })
    .use('/', require('./routes'));

initDb((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    }

    console.log('MongoDB connected successfully.');

    app.use('/user', userRouter);
    app.use('/observation', observationRouter);

    app.listen(process.env.PORT || port, () => {
        console.log('Web Server is listening at port ' + (process.env.PORT || port));
    });
});
