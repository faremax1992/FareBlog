(function(){
  syncText('#user_a', '#password_a');

  // 密码框同步加密
  function syncText(id_source, id_target){
    var $source = $(id_source);
    var $target = $(id_target);
    // 由于 keyup 所以不影响 cookie
    $source.on('keyup', function(){
      $target.val($.md5($source.val()));
    });
  }

  // 登录页
  if($('#login-submit').length){
    // 获取 cookies 并写入
    console.log('login page!');
    var userName = Cookies.get('user-name');
    var password = Cookies.get('password');
    console.log('user: ', userName);
    console.log('psd: ', password);
    if(userName){
      $('#email').val(userName);
      if(password){
        $('#password-target').val(password);
        $('#password-source').val('10102020Abcd.');
      }
    }
    // 密码框同步加密
    syncText('#password-source', '#password-target');

    // 提交时重写 cookie
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

  // 修改密码页 密码框同步加密
  if($('#password-submit').length){
    syncText('#password-source', '#password-target');
    syncText('#confirm-source', '#confirm-target');
  }

  // 注册用户页 密码框同步加密
  if($('#register-submit').length){
    syncText('#confirm-source', '#confirm-target');
    syncText('#password-source', '#password-target');
  }


})();
