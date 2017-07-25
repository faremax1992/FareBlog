

var config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  loremipsum = require('lorem-ipsum'),
  slug = require('slug');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var Post = mongoose.model('Post');
var User = mongoose.model("User");
var Category = mongoose.model("Category");

User.findOne(function(err, user){
  if(err) {
    return console.log('cannot find user');
  }
  Category.find(function(err, categories) {
    if(err) {
      return console.log('cannot find category');
    }
    categories.forEach(function(category){
      for(let i = 0; i < 39; i++){
        var title = loremipsum({count: 1, units: 'sentence'});
        var post = new Post({
          title: title,
          content: loremipsum({count: 30, units: 'sentence'}),
          slug: slug(title),
          category: category,
          author: user,
          published: true,
          meta: {favourites: 0},
          comments: [],
          created: new Date
        });
        post.save(function(err, post){
          console.log('saved post ', post.slug);
        });
      }
    });
  });
});
