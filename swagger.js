const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Astronomy Observation API',
    description: 'API for managing users and astronomy observations'
  },
  host: 'project-two-hu6p.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/dashboard.js',
  './routes/observation.js',
  './routes/user.js',
  './routes/auth.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);