(function(){
  syncText('#user_a', '#password_a');

  function syncText(id_source, id_target){
    var $source = $(id_source);
    var $target = $(id_target);
    $(function(){
      if($source.val() !== ""){
        $target.val($.md5($source.val()));
      }
    });
    $source.on('keyup', function(){
      $target.val($.md5($source.val()));
    });
  }

  if($('#login-submit').length){
    syncText('#password-source', '#password-target');
  }

  if($('#password-submit').length){
    syncText('#password-source', '#password-target');
    syncText('#confirm-source', '#confirm-target');
  }

  if($('#register-submit').length){
    syncText('#confirm-source', '#confirm-target');
    syncText('#password-source', '#password-target');
  }
})()
