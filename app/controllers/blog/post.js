var express = require('express'),
  router = express.Router(),
  marked = require('marked'),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  clearUtil = require('../toolFunc')
  Category = mongoose.model('Category');

// 文章列表页
module.exports = function (app) {
  app.use('/posts', router);
};

// 初始化 markdown 设置
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

// 渲染文章列表页
router.get('/', function (req, res, next) {
  // 只显示已发布的
  var conditions = {published: true};
  // 获取查找条件
  if(req.query.keyword){
    conditions.title = new RegExp(req.query.keyword.trim(), 'i');
    conditions.content = new RegExp(req.query.keyword.trim(), 'i');
  }
  // 查找文章获取文章列表
  Post.find(conditions)
      .sort('-created')
      .populate('category')
      .populate('author')
      .exec(function (err, posts) {
        if (err) return next(err);

        // 分页设置
        var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
        var pageSize = 8;   //每页 8 篇

        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount / pageSize);

        // 确保页码合理
        if(pageNum > pageCount){
          pageNum = pageCount;
        }
        if(pageNum <= 0){
          pageNum = 1;
        }

          // 计算分页器显示范围
        var start = pageNum - 3;
        var end = pageNum + 3;
        if(start <= 0) start = 1;
        if(end > pageCount) end = pageCount;

        var posts_sliced = posts.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        // 解析 markdown 文本
        for(var i = 0, len = posts_sliced.length; i < len; i++){
          var marked_content = marked(posts_sliced[i].content);
          marked_content = clearUtil.clearScripts(marked_content);
          marked_content = clearUtil.clearXMLTags(marked_content);
          marked_content = clearUtil.clearReturns(marked_content);
          posts_sliced[i].summary = marked_content;
        }

        var messages
        if(totalCount > 0){
          messages = '';
        } else {
          // 如果查不到
          messages = {'error':'未查到相关文章'};
        }

        // 渲染页面
        res.render('blog/index', {
          title: "FareBlog",
          posts: posts_sliced,
          pageNum: pageNum,
          pageCount: pageCount,
          start: start,
          end: end,
          messages: messages
        });

      });
});

// 分类页面渲染
router.get('/category/:name', function (req, res, next) {
  // 验证输入
  if(!req.params.name) return next(new Error('No Category Name Provided'));
  // 查找分类id
  Category.findOne({name: req.params.name}).exec(function(err, category){
    if(err) return next(err);
    // 查找文章列表
        if(!category){
      // 如果分类不存在
      res.render('blog/category', {
        title: "FareBlog-" + req.params.name,
        posts: [],
        pageNum: 0,
        pageCount: 0,
        start: 0,
        end: 0,
        category: '',
        totalLen: 0,
        messages: {'error':'不存在该分类'}
      });
    } else {
      // 如果分类存在
      Post.find({category: category, published: true})
        .sort('created')
        .populate('author')
        .populate('category')
        .exec(function(err, posts){
          if(err) return next(err);
                    // 分页设置
          var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
          var pageSize = 8;

          var totalCount = posts.length;
          var pageCount = Math.ceil(totalCount / pageSize);

          // 确保页码合理
          if(pageNum > pageCount){
            pageNum = pageCount;
          }
          if(pageNum <= 0){
            pageNum = 1;
          }

          // 计算分页器显示范围
          var start = pageNum - 3;
          var end = pageNum + 3;
          if(start <= 0) start = 1;
          if(end > pageCount) end = pageCount;

          var summaries = [];
          var posts_sliced = posts.slice((pageNum - 1) * pageSize, pageNum * pageSize);
          // 解析 markdown 文本
          for(var i = 0, len = posts_sliced.length; i < len; i++){
            var marked_content = marked(posts_sliced[i].content);
            marked_content = clearUtil.clearScripts(marked_content);
            marked_content = clearUtil.clearXMLTags(marked_content);
            marked_content = clearUtil.clearReturns(marked_content);
            posts_sliced[i].summary = marked_content;
          }
          // 渲染页面
          res.render('blog/category', {
            title: "FareBlog-" + req.params.name,
            posts: posts_sliced,
            pageNum: pageNum,
            pageCount: pageCount,
            start: start,
            end: end,
            category: category,
            totalLen: totalCount,
            messages: '',
          });
      });
    }
  });
});

router.get('/view/:id', getPostById, function (req, res, next) {

  var reply = false, to = '', s = '';  // 用于回复
  var post = req.post;

  var action = "/posts/comment/" + post._id;
  if(req.query.to && s < post.comments.length && s >= 0) {
    to = req.query.to;
    reply = true;
    action = "/posts/reply/" + post._id;
    s = req.query.s;
  }

  var comments = post.comments;
  comments.forEach(function(item){
    item.content = item.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    item.subs.forEach(function(sub){
      sub.content = sub.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    });
  });

  res.render('blog/view', {
    title: "FareBlog-" + post.title,
    post: post,
    comments: comments,
    content: '',
    category: post.category,
    messages: req.flash('info'),
    mdContent: marked(post.content),
    to: to,
    action: action,
    reply: reply,
    s: s
  });
});

// 同步加载点赞数据
router.get('/favourite/:id', function (req, res, next) {
  if(!req.params.id) return next(new Error('No Post Id Provided'));

  // 提供 id 和 slug 两种查询方式
  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  //查找修改点赞数据并重定向返回
  Post.findOne(conditions)
      .populate('author')
      .populate('category')
      .exec(function(err, post){
          if(err) return next(err);
            post.meta.favourites = post.meta.favourites ? post.meta.favourites + 1 : 1;
            post.markModified('meta');
            post.save(function(err){
              res.redirect('/posts/view/' + post._id)
            })
        });
});

// 提交评论
router.post('/comment/:id', getPostById, function (req, res, next) {
  // 输入信息验证
  req.checkBody('content', '内容不能为空').notEmpty();
  req.checkBody('name', '标题不能为空').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    req.flash('error', errors[0].msg);
    return res.redirect('/posts/view/' + req.post._id);
  }

  // 处理可能的注入脚本
  req.body.name = clearUtil.clearScripts(req.body.name);
  req.body.name = clearUtil.clearXMLTags(req.body.name);
  req.body.content = clearUtil.TransferTags(req.body.content);

  // 构建一个评论对象
  var comment = {
    name: req.body.name,
    content: req.body.content,
    created: new Date(),
    subs: []
  };

  // 评论的用户名设置为 cookie
  res.cookie('comment-name', req.body.name, {path: '/posts'});

  req.post.comments.unshift(comment);  // 默认按时间排列
  req.post.markModified('comments');

  // 保存评论
  req.post.save(function(err,post){
  if(err){
    req.flash('error', '评论失败');
  } else {
    req.flash('error', '评论成功');
  }
    res.redirect('/posts/view/' + req.post._id)
  });

});

// 提交评论
router.post('/reply/:id', getPostById, function (req, res, next) {
  // 输入信息验证
  req.checkBody('content', '内容不能为空').notEmpty();
  req.checkBody('name', '标题不能为空').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    req.flash('error', errors[0].msg);
    return res.redirect('/posts/view/' + req.post._id);
  }

  // 查找当前文章
  var index = req.body.s;
  var post = req.post;
  if(index < 0 || index >= post.comments.length) return next(new Error('Parameter Error'));

  // 处理可能的注入脚本
  req.body.name = clearUtil.clearScripts(req.body.name);
  req.body.name = clearUtil.clearXMLTags(req.body.name);
  req.body.content = clearUtil.TransferTags(req.body.content);

  // 构建一个评论对象
  var reply = {
    from: req.body.name,
    content: req.body.content,
    to: req.body.to,
    created: new Date()
  };

  // 评论的用户名设置为 cookie
  res.cookie('comment-name', req.body.name, {path: '/posts'});

  post.comments[index].subs.push(reply);     // 默认按时间排列
  post.markModified('comments');

  // 保存评论
  req.post.save(function(err,post){
  if(err){
    req.flash('error', '回复失败');
  } else {
    req.flash('error', '回复成功');
  }
    res.redirect('/posts/view/' + post._id)
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
