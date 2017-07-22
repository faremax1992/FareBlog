
(function(){
  // 防止原有 onload 被覆盖
  var onloadFun;
  if(document.body.onload){
    onloadFun = document.body.onload;
  }

  // 对用户名进行 cookie 报存，并再再次使用时读取
  document.body.onload = function(){
    if(onloadFun){
      onloadFun();
    }
    var name = Cookies.get('comment-name');
    var $username = $('#alias');
    if(name){
      $($username.val(name));
      $username.attr('readonly', true);
    }
  }
})();
