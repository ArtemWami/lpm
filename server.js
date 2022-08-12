require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./src/models');
const { handleError } = require('./src/middlewares/errorHandler');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(morgan('dev'));

//PUBLIC DIR
app.use('/public', express.static(process.env.PUBLIC_DIR));

// ENABLE BODY PARSER
app.use(bodyParser.json());

// DB CONNECTION
try {
  sequelize.sync({ logging: false });
  console.log('Connection with database has been established successfully.');
} catch (err) {
  console.log('Unable to connect to the database:', err);
  process.exit(-1);
}

// CREATE SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ENABLE CORS
app.use(cors());

// ROUTES
app.use('/api/v1', require('./src/connections/routes'));
app.use(handleError);

// RENDER ADMIN
const buildPath = path.join(__dirname, 'admin', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  });
}

app.listen(process.env.PORT, () => {
  console.log(`SERVER STARTED ON ${process.env.PORT} PORT`);
});

app.keepAlive = 65000;
app.headersTimeout = 66000;
