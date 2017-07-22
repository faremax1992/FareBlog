(function(){
  var $content = $('#js-post-content');
  var $markdown = $('#js-post-marked');

  //每隔 1.5s 将用户输入数据转换为 markdown 格式化数据
  setInterval(function() {
    var content = $content.val();
    var fragments = content.split('```');
    for(var i = 0, leni = fragments.length; i < leni; i+=2){
      var frags = fragments[i].split('`');
      for(var j = 0, lenj = frags.length; j < lenj; j+=2){
        frags[j] = frags[j].replace(/<script>.*?<\/script>/ig,'').replace(/<[^>]+>/g, '');
      }
      fragments[i] = frags.join('`');
    }
    content = fragments.join('```');

    $markdown.html(marked(content));
  }, 1500);

})();
