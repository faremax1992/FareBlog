(function(){
  var $remember = $('#remember-me');
  $('#login-submit').on('click', function(){
    console.log($remember.checked);
    if($remember.checked){
      Cookie.set('user-name', $('#email').val());
    }
  })
})();
