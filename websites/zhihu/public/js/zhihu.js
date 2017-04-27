var disclaimer = "Zhihu is a trademark of Zhihu. Inc. This app is not created nor endorsed by Zhihu Inc. All the information and content accessible through Zhihu Daily Purify are subject to Zhihu's copyright and terms of use. This is a free app and does not charge for anything. All content are available for free from Zhihu\n 『知乎』是 知乎. Inc 的注册商标。本软件与其代码非由知乎创作或维护。软件中所包含的信息与内容皆违反版权与知乎用户协议。它是一个免费软件，使用它不收取您任何费用。其中的所有内容均可在知乎获取。";
if(document.cookie.indexOf("firstInEasyZhihu") < 0){
  App.dialog({
    title: 'Disclaimer 声明',
    text: disclaimer,
    okButton: 'OK',
    cancelButton : 'Cancel'
  });
}
document.cookie = "firstInEasyZhihu=true";

$.fn.template = function(data){
  var template = $(this[0]).html().trim();
  if(typeof data === "object"){
    for(var key in data){
      template = template.replace(new RegExp('\\${' + key + '}', 'g'), data[key]);
    }
    return template;
  }
};

function getImageProxyURI(img){
  return "/img/proxy?img=" + encodeURIComponent(img);
}

App.controller('home', function (page) {
  $(page).on('appReady', function () {
    $(page).find('.page-loading').hide();
  });
  $(page).find('.page-loading').show();
  var $container = $(page).find('#js-story-container');
  var $topContainer = $(page).find('#js-top-story-container')
  var $template = $(page).find('#js-story-template');
  $.getJSON('/api/4/news/latest', function(data){
    if(data.stories && data.stories.length){
      for(var i = 0, n = data.stories.length; i < n; i++){
        var item = {
          image: getImageProxyURI(data.stories[i].images[0]),
          title: data.stories[i].title,
          id: data.stories[i].id
        };
        $container.append($template.template(item));
      }
    }
    if(data.top_stories && data.top_stories.length){
      for(var i = 0, n = data.top_stories.length; i < n; i++){
        var item = {
          image: getImageProxyURI(data.top_stories[i].image),
          title: data.top_stories[i].title,
          id: data.top_stories[i].id
        };
        $(page).find('.page-loading').hide();
        $topContainer.append($template.template(item));
      }
    }
  });
});

App.controller('detail', function (page, args) {
  $(page).on('appReady', function () {
    $(page).find('.page-loading').hide();
  });
  $(page).find('.page-loading').show();
  $.getJSON('/api/4/news/' + args.id, function(data){
    var body = $(data.body);
    body.find('.view-more').remove();
    body.find('img').each(function(i, img){
      var nodeImg = $(img);
      nodeImg.attr('src', getImageProxyURI(nodeImg.attr('src')));
    });

    $(page).find('.js-story-title').html(data.title);
    $(page).find('.js-story-cover').attr('src', getImageProxyURI(data.image));
    $(page).find('.js-comment-button').attr('data-target-args', JSON.stringify(args));
    $(page).find('.js-story-content').html(body);
  });
});

App.controller('comments', function(page, args){
  $(page).on('appReady', function () {
    $(page).find('.page-loading').hide();
  });
  $(page).find('.page-loading').show();
  var $container = $(page).find('#js-comment-container');
  var $template = $(page).find('#js-comment-template');
  $.getJSON('/api/4/news/' + args.id + '/long-comments', function(data){
    console.log(data);
    if(data.comments && data.comments.length){
      for(var i = 0, n = data.comments.length; i < n; i++){
        var time = new Date(data.comments[i].time).toTimeString();
        time = time.slice(0, time.indexOf(' '));
        var item = {
          image: getImageProxyURI(data.comments[i].avatar),
          title: data.comments[i].author,
          content: data.comments[i].content,
          time: time,
          likes: data.comments[i].likes
        };
        $(page).find('.page-loading').hide();
        $container.append($template.template(item));
      }
      // $container.append('<h4 class="empty">别划了，我是有底线的</h4>');
    } else {
      $(page).find('.page-loading').hide();
      $container.append('<h3 class="empty"><i class="fa fa-commenting"></i>哎呀，这里还没有人来过</h3>');
    }
  });
});
try {
  App.restore();
} catch (err) {
  App.load('home');
}
