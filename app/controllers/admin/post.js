var express = require('express'),
  slug = require('slug'),
  pinyin = require('pinyin'),
  marked = require('marked'),
  clearUtil = require('../toolFunc'),
  router = express.Router(),
  mongoose = require('mongoose'),
  auth = require('./user'),
  Post = mongoose.model('Post'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category');

//初始化 markdown 配置
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

// 文章管理页面路由
module.exports = function (app) {
  app.use('/admin/posts', router);
};

// 文章管理页面渲染
router.get('/', auth.requireLogin, function (req, res, next) {
  var sortby = req.query.sortby ? req.query.sortby : 'created';  // 默认按创建时间排序
  var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';  // 默认倒序排序

  // 输入验证，排除非法输入
  if(['title', 'category', 'created', 'published'].indexOf(sortby) === -1){
    sortby = 'created';
  }
  if(['desc', 'asc'].indexOf(sortdir) === -1){
    sortdir = 'desc';
  }

  // 构建排序信息对象
  var sortObj = {};
  sortObj[sortby] = sortdir;

  // 构建查询条件信息对象
  var conditions = {};
  if(req.query.category){
    conditions.category = req.query.category.trim();
  }
  if(req.query.keyword){
    conditions.title = new RegExp(req.query.keyword.trim(), 'i');
    conditions.content = new RegExp(req.query.keyword.trim(), 'i');
  }

  //查找
  Post.find(conditions)
      .sort(sortObj)
      .populate('category')    //级联查找
      .populate('author')
      .exec(function (err, posts) {
        //return res.json(posts);
        if (err) return next(err);

        // 分页设置
        var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
        var pageSize = 8;   // 每页 8 篇

        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount / pageSize);  //计算总页数

        // 处理非法页码输入
        if(pageNum > pageCount){
          pageNum = pageCount;
        }
        if(pageNum <= 0){
          pageNum = 1;
        }

        //计算页码部分显示区域
        var start = pageNum - 3;
        var end = pageNum + 3;
        if(start <= 0) start = 1;
        if(end > pageCount) end = pageCount;

        // 渲染页面
        res.render('admin/post/index', {
          title: "FareBlog",
          posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          pageNum: pageNum,
          sortdir: sortdir,
          sortby: sortby,
          pageCount: pageCount,
          start: start,
          end: end,
          filter: {
            category: req.query.category || '',
            keyword: req.query.keyword || ''
          }
        });
      });
});

// 添加文章页面渲染
router.get('/add', auth.requireLogin, function (req, res, next) {
  res.render('admin/post/add', {
    title: "FareBlog",
    action: "/admin/posts/add",
    post: {
      category: {_id: ""}
    }
  });
});

// 文章添加提交
router.post('/add', auth.requireLogin, function (req, res, next) {
  // 检查用户输入
  req.checkBody('title', '文章标题不能为空').notEmpty();
  req.checkBody('category', '必须指定文章分类').notEmpty();
  req.checkBody('content', '文章内容不能为空').notEmpty();

  // 获取当然用户
  if(req.user){
    var currentUser = req.user._id.toString();
  } else {
    req.flash('error', '登录超时，请重新登录');
    return res.redirect('/admin/users/login');
  }

  // 验证输入错入
  var errors = req.validationErrors();
  if(errors){
    return res.render('admin/post/add', {
      errors: errors,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });
  }

  // 处理可能的注入代码
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content = req.body.content;

  title = clearUtil.clearScripts(title);
  title = clearUtil.clearXMLTags(title);
  title = clearUtil.clearReturns(title);

  // 按 markdown 规则格式化内容
  content = formatContent(content);

  // 查找用户，添加文章
  User.findOne({_id: currentUser},function(err, author){
    if(err){
      return next(err);
    }

    // 通过拼音解决中文添加失败的 bug
    var py = pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false
    }).map(function(item){
      return item[0];
    }).join(' ');

    var published = true;
    if(req.body.handscript === 'on'){
      published = false;
    }

    // 构建文章
    var post = new Post({
      title: title,
      category: category,
      content: content,
      author: author._id,
      meta: {favourite: 0},
      comments: [],
      slug: slug(py),
      created: new Date(),
      published: published
    });

    // 保存文章
    post.save(function(err, post){
      if(err){
        req.flash('error', '文章保存失败');
        res.redirect('/admin/posts/add');
        return next(err);
      }else{
        req.flash('error', '文章保存成功');
        res.redirect('/admin/posts');
      }
    });
  });
});

// 文章编辑，重用文章添加页
router.get('/edit/:id', auth.requireLogin, getPostById, function (req, res, next) {
  res.render('admin/post/add', {
    title: "FareBlog-" + req.post.title,
    action: "/admin/posts/edit/" + req.post._id,
    post: req.post
  });
});

// 文章编辑提交
router.post('/edit/:id', auth.requireLogin, getPostById, function (req, res, next) {
  // 获取信息
  var post = req.post;
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content = req.body.content;

  // 处理可能的注入代码
  title = clearUtil.clearScripts(title);
  title = clearUtil.clearXMLTags(title);
  title = clearUtil.clearReturns(title);

  // 按 markdown 规则格式化内容
  content = formatContent(content);

  // 通过拼音解决中文添加失败的 bug
  var py = pinyin(title, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  }).map(function(item){
    return item[0];
  }).join(' ');

  // 记录修改信息
  post.title = title;
  post.category = category;
  post.content = content;
  post.slug = slug(py);

  // 文章保存
  post.save(function(err, post){
    if(err){
      req.flash('error', '文章编辑失败');
      res.redirect('/admin/posts/edit/' + post._id);
      return next(err);
    }else{
      req.flash('error', '文章编辑成功');
      res.redirect('/admin/posts/');
    }
  });
});

// 删除文章
router.get('/delete/:id', auth.requireLogin, getPostById, function (req, res, next) {
  var currPage = req.query.page ? req.query.page : 1;
  req.post.remove(function(err, rowsRemoved){
    if(err) next(err);
    if(rowsRemoved){
      req.flash('success', '文章删除成功');
    } else {
      req.flash('fail', '文章删除失败');
    }
    if(currPage === 1){
      res.redirect('/admin/posts');
    } else {
      res.redirect('/admin/posts?page=' + currPage);
    }
  });
});

// 工具函数，根据分类 id 查看w文章，结果放在 req.post 中，可作为中间件使用
function getPostById(req, res, next){
  if(!req.params.id) return next(new Error('No Post Id Provided'));

  Post.findOne({_id: req.params.id})
      .populate('author')
      .populate('category')
      .exec(function(err, post){
        if(err) return next(err);
        if(!post) return next(new Error('post not found: ', req.params.id));
        req.post = post;
        next();
      });
}
// 工具函数，格式化文件内容，适配 markdown 语法
function formatContent(content){
  if(!content) return '';
  var fragments = content.split('```');
  for(var i = 0, leni = fragments.length; i < leni; i+=2){
    var frags = fragments[i].split('`');
    for(var j = 0, lenj = frags.length; j < lenj; j+=2){
      frags[j] = clearUtil.clearScripts(frags[j]);
      frags[j] = clearUtil.clearXMLTags(frags[j]);
    }
    fragments[i] = frags.join('`');
  }
  content = fragments.join('```');
  return content;
}








