var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.redirect('/posts');
});

router.get('/blog', function (req, res, next) {
  res.render('blog/index', {
    title: 'FareBlog',
    pretty: true
  });
});

