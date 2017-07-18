(function(){
  syncText('#user_a', '#password_a');

  function syncText(id_source, id_target){
    var $source = $(id_source);
    var $target = $(id_target);
    // $(function(){
    //   if($source.val() !== ""){
    //     $target.val($.md5($source.val()));
    //   }
    // });
    $source.on('keyup', function(){
      $target.val($.md5($source.val()));
    });
  }

  if($('#login-submit').length){
    var userName = Cookies.get('user-name');
    var password = Cookies.get('password');
    if(userName){
      $('#email').val(userName);
      if(password){
        $('#password-target').val(password);
        $('#password-source').val('10102020Abcd.');
      }
    }
    syncText('#password-source', '#password-target');
    $('#login-submit').on('click', function(){
      if($('#remember-me').prop('checked')){
        var userName = $('#email').val();
        var password = $('#password-target').val();
        Cookies.set('user-name', userName, {path: '/admin', expires: 1000 * 24 * 3600});
        Cookies.set('password', password, {path: '/admin',expires: 1000 * 24 * 3600});
      } else {
        Cookies.set('user-name', '', {path: '/admin', expires: -1000});
        Cookies.set('password', '', {path: '/admin', expires: -1000});
      }

  });
  }


  if($('#password-submit').length){
    syncText('#password-source', '#password-target');
    syncText('#confirm-source', '#confirm-target');
  }

  if($('#register-submit').length){
    syncText('#confirm-source', '#confirm-target');
    syncText('#password-source', '#password-target');
  }


})();
