const {app} = require('./app');

// Explore routing and use of regex in routes and use of ?, +, (), *, and so on
// Reading of Dynamic Routes: https://expressjs.com/en/guide/routing.html

app.get('/ab*cd', (req, res) => {
  res.send({
    message: 'ab*cd',
    description:
      'Pattern match example this will work for /abcd, /abxcd, /abFOOcd, /ab123cd, and so on', //
  });
});

app.get('/ab?c', (req, res) => {
  res.send({
    message: 'ab*cd',
    description:
      'Pattern match example this will work for /abc, /ab1c, /ab2c, /ac and so on,', //
  });
});

app.get('/ab+c', (req, res) => {
  res.send({
    message: 'ab*cd',
    description:
      'Pattern match example this will work for /abc, /abbc, /abbbc, /abbbbc and so on', //
  });
});

app.get('/user/:userId', (req, res) => {
  let userId = req.params.userId;
  res.send({
    message: 'user/:userId',
    userId: userId,
    description: `Pattern match example this will work for /user/123, /user/abc, /user/xyz and so on`,
  });
});
