var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/posts', router);
};

router.get('/', function (req, res, next) {
  Post.find({published: true})
      .sort('created')
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

        res.render('blog/index', {
          title: "FareBlog",
          posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          pageNum: pageNum,
          pageCount: pageCount,
          pretty: true
        });
      });
});

router.get('/', function (req, res, next) {

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
            res.render('blog/category', {
            title: "FareBlog-" + req.params.name,
            posts: posts,
            category: category,
            pretty: true
          });
        })
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
            pretty: true
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

          var comment = {
            name: req.body.name,
            content: req.body.content,
            created: new Date()
          };

          post.comments.unshift(comment);
          post.markModified('comments');
          post.save(function(err,post){
            req.flash('info', '评论成功');
            res.redirect('/posts/view/' + post.slug)
          })
        });
});

