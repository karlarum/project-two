const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/api-docs', (req, res, next) => {
    try {
        swaggerUi.setup(swaggerDocument)(req, res, next);
    } catch (error) {
        console.error('Error loading Swagger documentation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
