var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

// 主页渲染
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'FareMax'
  });
});

// 博客首页渲染
router.get('/blog', function (req, res, next) {
  res.render('blog/index', {
    title: 'FareBlog'
  });
});

