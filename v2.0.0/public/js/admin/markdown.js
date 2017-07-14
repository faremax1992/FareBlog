(function(){
  var $content = $('#js-post-content');
  var $markdown = $('#js-post-marked');

  var timer = setInterval(function() {
    $markdown.html(marked($content.val()));
  }, 1000);
  window.timer = timer;

})();
