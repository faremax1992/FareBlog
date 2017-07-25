var express = require('express'),
  slug = require('slug'),
  pinyin = require('pinyin'),
  router = express.Router(),
  mongoose = require('mongoose'),
  auth = require('./user'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category');

// 分类页路由设置
module.exports = function (app) {
  app.use('/admin/categories', router);
};

// 分类页主页；auth.requireLogin 是验证登录信息的中间件
router.get('/', auth.requireLogin, function (req, res, next) {
  res.render('admin/category/index', {
    title: "FareBlog"
  });
});

// 添加分类页面，编辑分类重用
router.get('/add', auth.requireLogin, function (req, res, next) {
  res.render('admin/category/add', {
    title: "FareBlog",
    action: "/admin/categories/add",
    category: {_id: ""}
  });
});

// 添加/编辑分类 提交动作 同步数据传输
router.post('/add', auth.requireLogin, function (req, res, next) {
  // 输入验证是否为空
  req.checkBody('name', '分类名字不能为空').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    return res.render('/admin/categories/add', {
      errors: errors,
      name: req.body.name
    })
  }

  // 通过拼音解决中文添加失败的 bug
  var name = req.body.name.trim();
  var py = pinyin(name, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  }).map(function(item){
    return item[0];
  }).join(' ');

  // 创建新的分类
  var category = new Category({
    name: name,
    slug: slug(py),
    created: new Date()
  });

  // 保存分类到数据库
  category.save(function(err, category){
    if(err){
      req.flash('error', '分类创建失败');
      res.redirect('/admin/categories/add');
      return next(err);
    }else{
      req.flash('error', '分类创建成功');
      res.redirect('/admin/categories');
    }
  });
});

// 分类编辑功能，重用了添加分类页
router.get('/edit/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
  res.render('admin/category/add', {
    title: "FareBlog-" + req.category.title,
    action: "/admin/categories/edit/" + req.category._id,
    category: req.category
  });
});

// 分类编辑提交，
router.post('/edit/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
  var category = req.category;
  var name = req.body.name.trim();

  // 通过拼音解决中文添加失败的 bug
  var py = pinyin(name, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  }).map(function(item){
    return item[0];
  }).join(' ');

  // 修改分类中的字段
  category.name = name;
  category.slug = slug(py);

  // 保存分类
  category.save(function(err, category){
    if(err){
      req.flash('error', '分类编辑失败');
      res.redirect('/admin/categories/edit/' + category._id);
      return next(err);
    }else{
      req.flash('error', '分类编辑成功');
      res.redirect('/admin/categories/');
    }
  });
});

// 删除分类，同步提交
router.get('/delete/:id', auth.requireLogin, getCategoryById, function (req, res, next) {
  var currPage = req.query.page ? req.query.page : 1;

  Post.findOne({category: req.params.id}, function(err, post){
    if(post) {
        req.flash('fail', '分类不为空, 无法删除');
      if(currPage === 1){
        res.redirect('/admin/categories');
      } else {
        res.redirect('/admin/categories?page=' + currPage);
      }
    } else{
      req.category.remove(function(err, rowsRemoved){
        if(err) next(err);
        if(rowsRemoved){
          req.flash('success', '分类删除成功');
        } else {
          req.flash('fail', '分类删除失败');
        }
        if(currPage === 1){
          res.redirect('/admin/categories');
        } else {
          res.redirect('/admin/categories?page=' + currPage);
        }
      });
    }
  });
});

// 工具函数，根据分类 id 查看分类，结果放在 req.category 中，可作为中间件使用
function getCategoryById(req, res, next){
  if(!req.params.id) return next(new Error('No Post Id Provided'));

  Category.findOne({_id: req.params.id})
      .exec(function(err, category){
        if(err) return next(err);
        if(!category) return next(new Error('category not found: ', req.params.id));
        req.category = category;
        next();
      });
}






