// imports
const express = require('express');
const createErrors = require('http-errors');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user.route');
const areaRoute = require('./routes/area.route');
const postRoute = require('./routes/post.route');
const cors = require('cors');

// constants
const app = express();

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

require('dotenv').config();
require('./utils/mongodb.util');

// constants
const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});

// routes
app.get('/', (req, res) => {
  res.send('Hello CF');
});

app.use('/user', userRoute);
app.use('/area', areaRoute);
app.use('/post', postRoute);

// handle wildcard route
app.use(async (req, res, next) => {
  next(createErrors.NotFound('This route does not exists!'));
});

// handle errors
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.status = 400;
  }
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal server error',
    },
  });
});

// exports
module.exports = app;
