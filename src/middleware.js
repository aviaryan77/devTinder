const {app} = require('./app');

app.use(
  '/user/:userId',
  (req, res, next) => {
    console.log('Time:', Date.now());
    next();
  },
  (req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log('Request Type:', req.method);
    res.send({
      message: 'user/:userId',
      userId: req.params.userId,
      description: `Pattern match example this will work for /user/123, /user/abc, /user/xyz and so on`,
    });
  }
);
