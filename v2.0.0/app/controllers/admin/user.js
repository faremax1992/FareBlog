var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/admin/users', router);
};

router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('admin/user/login', {
    title: 'FareBlog - Login'
  });
});

router.post('/login', function (req, res, next) {
  res.jsonp(req.body);
});

router.get('/logout', function (req, res, next) {
  //Todo
  res.redirect('/');
});

router.get('/password', function (req, res, next) {
  res.render('admin/user/password', {
    title: "FareBlog"
  });
});
