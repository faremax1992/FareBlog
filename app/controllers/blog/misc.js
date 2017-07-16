var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'FareMax'
  });
});

router.get('/blog', function (req, res, next) {
  res.render('blog/index', {
    title: 'FareBlog'
  });
});

