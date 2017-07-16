var express = require('express'),
  router = express.Router(),
  marked = require('marked'),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  clearUtil = require('../toolFunc')
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/posts', router);
};

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

router.get('/', function (req, res, next) {
  var conditions = {published: true};
  if(req.query.keyword){
    conditions.title = new RegExp(req.query.keyword.trim(), 'i');
    conditions.content = new RegExp(req.query.keyword.trim(), 'i');
  }
  Post.find(conditions)
      .sort('-created')
      .populate('category')
      .populate('author')
      .exec(function (err, posts) {
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
        if(start < 0) start = 1;
        if(end > pageCount) end = pageCount;

        var summaries = [];
        var posts_sliced = posts.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        for(var i = 0, len = posts_sliced.length; i < len; i++){
          var marked_content = marked(posts_sliced[i].content);
          marked_content = clearUtil.clearScripts(marked_content);
          marked_content = clearUtil.clearXMLTags(marked_content);
          marked_content = clearUtil.clearReturns(marked_content);
          posts_sliced[i].summary = marked_content;
        }

        res.render('blog/index', {
          title: "FareBlog",
          posts: posts_sliced,
          pageNum: pageNum,
          pageCount: pageCount,
          start: start,
          end: end
        });
      });
});

router.get('/category/:name', function (req, res, next) {
  if(!req.params.name) return next(new Error('No Category Name Provided'));
  Category.findOne({name: req.params.name}).exec(function(err, category){
    if(err) return next(err);
    Post.find({category: category, published: true})
        .sort('created')
        .populate('author')
        .populate('category')
        .exec(function(err, posts){
          if(err) return next(err);

          var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
          var pageSize = 8;

          var totalCount = posts.length;
          var pageCount = Math.ceil(totalCount / pageSize);

          if(pageNum > pageCount){
            pageNum = pageCount;
          }

          var start = pageNum - 3;
          var end = pageNum + 3;
          if(start < 0) start = 1;
          if(end > pageCount) end = pageCount;

          var totalLen = posts.length;

          var summaries = [];
          var posts_sliced = posts.slice((pageNum - 1) * pageSize, pageNum * pageSize);
          for(var i = 0, len = posts_sliced.length; i < len; i++){
            var marked_content = marked(posts_sliced[i].content);
            marked_content = clearUtil.clearScripts(marked_content);
            marked_content = clearUtil.clearXMLTags(marked_content);
            marked_content = clearUtil.clearReturns(marked_content);
            posts_sliced[i].summary = marked_content;
          }

          res.render('blog/category', {
            title: "FareBlog-" + req.params.name,
            posts: posts_sliced,
            pageNum: pageNum,
            pageCount: pageCount,
            start: start,
            end: end,
            category: category,
            totalLen: totalLen
          });
      });
  });
});

router.get('/view/:id', function (req, res, next) {
  if(!req.params.id) return next(new Error('No Post Id Provided'));

  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions)
      .populate('author')
      .populate('category')
      .exec(function(err, post){
          if(err) return next(err);
          res.render('blog/view', {
            title: "FareBlog-" + post.title,
            post: post,
            category: post.category,
            messages: req.flash('info'),
            mdContent: marked(post.content)
          });
        });
});

router.get('/favourite/:id', function (req, res, next) {
  if(!req.params.id) return next(new Error('No Post Id Provided'));

  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions)
      .populate('author')
      .populate('category')
      .exec(function(err, post){
          if(err) return next(err);
            post.meta.favourites = post.meta.favourites ? post.meta.favourites + 1 : 1;
            post.markModified('meta');
            post.save(function(err){
              res.redirect('/posts/view/' + post.slug)
            })
        });
});

router.post('/comment/:id', function (req, res, next) {
  if(!req.body.name) return next(new Error('No E-mail Id Provided'));
  if(!req.body.content) return next(new Error('Content cannot be empty'));
  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  Post.findOne(conditions).exec(function(err, post){
    if(err) return next(err);

    req.body.name = clearUtil.clearScripts(req.body.name);
    req.body.name = clearUtil.clearXMLTags(req.body.name);
    req.body.content = clearUtil.TransferTags(req.body.content);

    var comment = {
      name: req.body.name,
      content: req.body.content,
      created: new Date(),
      subs: []
    };

    res.cookie('comment-name', req.body.name, {path: '/posts'});

    post.comments.unshift(comment);
    post.markModified('comments');
    post.save(function(err,post){
    if(err){
        req.flash('error', '评论成功');
    } else {
      req.flash('error', '评论成功');
    }
      res.redirect('/posts/view/' + post.slug)
    })
  });
});

