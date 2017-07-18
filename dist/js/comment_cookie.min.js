(function(){
  var name = Cookies.get('comment-name');
  var $username = $('#alias');
  if(name){
    $($username.val(name));
    $username.attr('readonly', true);
  }
})();
