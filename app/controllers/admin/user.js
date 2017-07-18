var express = require('express'),
  passport = require('passport'),
  router = express.Router(),
  mongoose = require('mongoose'),
  clearUtil = require('../toolFunc'),
  User = mongoose.model('User');


module.exports = function (app) {
  app.use('/admin/users', router);
};

var needLogin = function(req, res, next){
  if(req.user){
    next();
  } else {
    req.flash('error', '请先登录');
    res.redirect('/admin/users/login');
  }
}
module.exports.requireLogin = needLogin;

router.get('/', function (req, res, next) {
  res.redirect('users/login');
});

router.get('/login', function (req, res, next) {
  if(req.user){
    res.redirect('/admin/posts')
  }
  res.render('admin/user/login', {
    title: 'FareBlog - Login',
    email: '',
    remember: true,
    errors: ''
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/admin/users/login',
  failureFlash: '用户名或密码错误'
}), function (req, res, next) {
  res.redirect('/admin/posts');
});

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/posts');
});

router.get('/register', function (req, res, next) {
  res.render('admin/user/register', {
    title: 'FareBlog - Register',
    name: '',
    email: '',
    errors: ''
  });
});

router.post('/register', function (req, res, next) {
  req.checkBody('name', '用户名不能为空').notEmpty();
  req.checkBody('email', '邮箱不能为空').notEmpty().isEmail();
  req.checkBody('email', '邮箱格式不正确').isEmail();
  req.checkBody('password', '密码不能为空').notEmpty();
  req.checkBody('confirm', '两次输入密码不一致').notEmpty().equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    req.flash('error', errors[0].msg);
    return res.render('admin/user/register', {
      name: req.body.name,
      email: req.body.email
    });
  }

  User.findOne({email: req.body.email}, function(err, email){
    if(email !== null){
      req.flash('error', "该邮箱已被注册");
        return res.render('admin/user/register', {
        name: req.body.name,
        email: ''
      });
    }
    req.body.name = clearUtil.clearScripts(req.body.name);
    req.body.name = clearUtil.clearXMLTags(req.body.name);

    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      created: new Date()
    });

    user.save(function(err, user){
      if(err) {
        req.flash('error', "用户注册失败")
        res.render('admin/user/register', {
          name: req.body.name,
          email: req.body.email
        });
      } else {
        req.flash('success', "用户注册成功，请登录")
        res.render('admin/user/login',{
          email: req.body.email,
          remember: true
        });
      }
    });
  });
});

router.get('/password', needLogin, function (req, res, next) {
  res.render('admin/user/password', {
    title: "FareBlog",
    action: "/admin/users/password"
  });
});

router.post('/password', needLogin, function (req, res, next) {
  req.checkBody('password', '密码不能为空').notEmpty();
  req.checkBody('confirm', '两次输入密码不一致').notEmpty().equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    req.flash('error', errors[0].msg);
    return res.redirect('admin/user/password');
  }
  // console.log(req.user);
  var user_id = req.user._id.toString();
  User.update({
    _id: user_id
  }, {
    password: req.body.password
  }, function(err, raw){
    if(err){
      req.flash('error', '修改失败');
    } else {
      req.flash('success', '修改成功');
    }
    res.redirect('/admin/users/password');
  })

});















