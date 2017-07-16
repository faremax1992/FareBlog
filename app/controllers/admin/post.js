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

module.exports = function (app) {
  app.use('/admin/posts', router);
};

router.get('/', auth.requireLogin, function (req, res, next) {
  var sortby = req.query.sortby ? req.query.sortby : 'created';
  var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';

  if(['title', 'category', 'created', 'published'].indexOf(sortby) === -1){
    sortby = 'created';
  }
  if(['desc', 'asc'].indexOf(sortdir) === -1){
    sortdir = 'desc';
  }

  var sortObj = {};
  sortObj[sortby] = sortdir;

  var conditions = {};
  if(req.query.category){
    conditions.category = req.query.category.trim();
  }
  if(req.query.keyword){
    conditions.title = new RegExp(req.query.keyword.trim(), 'i');
    conditions.content = new RegExp(req.query.keyword.trim(), 'i');
  }

  Post.find(conditions)
      .sort(sortObj)
      .populate('category')
      .populate('author').
      exec(function (err, posts) {
        //return res.json(posts);
        if (err) return next(err);

        var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
        var pageSize = 8;

        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount / pageSize);

        if(pageNum > pageCount){
          pageNum = pageCount;
        }

        var start = pageNum - 3;
        var end = pageNum + 3;
        if(start <= 0) start = 1;
        if(end > pageCount) end = pageCount;

        console.log('start-end:', start, '-', end);

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

router.get('/add', auth.requireLogin, function (req, res, next) {
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

  res.render('admin/post/add', {
    title: "FareBlog",
    action: "/admin/posts/add",
    post: {
      category: {_id: ""}
    }
  });
});

router.post('/add', auth.requireLogin, function (req, res, next) {
  req.checkBody('title', '文章标题不能为空').notEmpty();
  req.checkBody('category', '必须指定文章分类').notEmpty();
  req.checkBody('content', '文章内容不能为空').notEmpty();

  var currentUser = req.user._id.toString();

  var errors = req.validationErrors();
  if(errors){
    return res.render('admin/post/add', {
      errors: errors,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    })
  }
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content = req.body.content;

  title = clearUtil.clearScripts(title);
  title = clearUtil.clearXMLTags(title);
  title = clearUtil.clearReturns(title);

  content = formatContent(content);

  User.findOne({_id: currentUser},function(err, author){
    if(err){
      return next(err);
    }

    var py = pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false
    }).map(function(item){
      return item[0];
    }).join(' ');

    var post = new Post({
      title: title,
      category: category,
      content: content,
      author: author._id,
      meta: {favourite: 0},
      comments: [],
      slug: slug(py),
      created: new Date(),
      published: true
    });

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

router.get('/edit/:id', auth.requireLogin, getPostById, function (req, res, next) {
  res.render('admin/post/add', {
    title: "FareBlog-" + req.post.title,
    action: "/admin/posts/edit/" + req.post._id,
    post: req.post
  });
});

router.post('/edit/:id', auth.requireLogin, getPostById, function (req, res, next) {
  var post = req.post;
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content = req.body.content;

  title = clearUtil.clearScripts(title);
  title = clearUtil.clearXMLTags(title);
  title = clearUtil.clearReturns(title);
  content = formatContent(content);

  var py = pinyin(title, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  }).map(function(item){
    return item[0];
  }).join(' ');

  post.title = title;
  post.category = category;
  post.content = content;
  post.slug = slug(py);

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








