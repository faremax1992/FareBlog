var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');

module.exports = function(app){
  app.use('/admin', router);
};

// /admin 没有主页，重定向到登录页
router.get('/', function(req, res,next){
  res.redirect('/admin/users/login');
});
