(function(){

  //以下绑定了一些事件
  var firstMask = document.getElementById('first_mask');
  var secondMask = document.getElementById('second_mask');
  var thirdMask = document.getElementById('third_mask');
  var mask = document.getElementById("mask");

  function off(){
    mask.style.display = "none";
    secondMask.style.display = "none";
    thirdMask.style.display = "none";
    firstMask.style.display = "block";
  }
  var confirm = document.getElementById("mask_confirm");
  var confirm2 = document.getElementById("mask_confirm2");
  var close = document.getElementById("mask_close");
  confirm.onclick = off;
  confirm2.onclick = off;
  close.onclick = off;

  function log(){
    mask.style.display = "block";
  }

  var login = document.getElementById("login");
  var login2 = document.getElementById("login2");
  var history = document.getElementById("history");
  history.onclick = log;
  login.onclick = log;
  login2.onclick = log;

  var goto_qr = document.getElementById('gotoqr');
  var goto_qr2 = document.getElementById('gotoqr2');
  var goto_pc = document.getElementById('gotopc');

  goto_qr.onclick = function(){
    firstMask.style.display = "none";
    secondMask.style.display = "block";
  };
  goto_qr2.onclick = function(){
    thirdMask.style.display = "none";
    secondMask.style.display = "block";
  };
  goto_pc.onclick = function(){
    firstMask.style.display = "block";
    secondMask.style.display = "none";
  };

  var gotoPhone = document.getElementById('gotophone');
  var gotoUser = document.getElementById('gotouser');

  gotoPhone.onclick = function(){
    firstMask.style.display = "none";
    thirdMask.style.display = "block";
  };
  gotoUser.onclick = function(){
    thirdMask.style.display = "none";
    firstMask.style.display = "block";
  };

  var downChoice = document.getElementById('down').getElementsByTagName('li');
  var downContent = document.getElementsByClassName('down_content');
  for(var i = 0; i < downChoice.length; i++){
    downChoice[i].onclick = function(){
      for(var j = 0; j < downChoice.length; j++){
        downChoice[j].className = "";
        downContent[j].style.display ="none";
      }
      this.className = "checked";
      var index = parseInt(this.getAttribute('data-num'));
      downContent[index].style.display = "block";
    };
  }

  var downClose = document.getElementById("down_close");
  var down = document.getElementById('down');
  downClose.onclick = function(){
    down.style.display = "none";
  };

  var sConf = document.getElementById('s_conf');
  var sAdv = document.getElementById('s_adv');

  sConf.onclick = function(){
    down.style.display = "block";
    downChoice[0].click();
  };
  sAdv.onclick = function(){
    down.style.display = "block";
    downChoice[1].click();
  };

  var pos = document.getElementById('pos');
  var mask = document.getElementById('mask');

  stopPro(mask, "click"); //防止登录遮罩层内事件冒泡
  stopPro(down, "click"); //防止下拉菜单层内事件冒泡
  stopPro(pos, "click"); //防止设置菜单层内事件冒泡

  //利用事件冒泡实现以下一个功能
  //点击设置浮动框（在上方）之外部分将该框隐藏

  //自定义函数，阻止事件冒泡
  function stopPro(target, event){
    if(target.addEventListener){
      target.addEventListener(event, function(e){
        e = e || window.event;
        if(e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
      },false);
    } else {
      target.attachEvent("on" + event,function(e){
        e = e || window.event;
        if(e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
      });
    }
  }
  document.addEventListener("click", function(){
    down.style.display="none";
  }, false);

  //上传照片部分
  document.getElementById('camera').onclick = function(){
    document.getElementById('upload').style.display = "block";
  }
  document.getElementById('drag_close').onclick = function(){
    document.getElementById('upload').style.display = "none";
  }

  document.addEventListener("dragenter", function(e){
    e = e || window.event;
    e.preventDefault();
    e.returnValue = false;
  })

  var dragArea = document.getElementById('drag_area')
  dragArea.addEventListener("dragenter", function(e){
    e = e || window.event;
    e.preventDefault();
    e.returnValue = false;
    e.stopPropagation();
    e.cancelBubble = true;
    dragArea.style.backgroundColor = "#eee";
  });

  dragArea.addEventListener("dragleave", function(e){
    e = e || window.event;
    e.preventDefault();
    e.returnValue = false;
    e.stopPropagation();
    e.cancelBubble = true;
    dragArea.style.backgroundColor = "#f6f6f6";
  });

  dragArea.addEventListener("drop", function(e){
    e = e || window.event;
    e.preventDefault();
    e.returnValue = false;
    e.stopPropagation();
    e.cancelBubble = true;
    dragArea.style.backgroundColor = "#f6f6f6";
    var cla = e.dataTransfer.files[0].name.slice(e.dataTransfer.files[0].name.indexOf("."), -1);
    if(/\.(jpg|png)/.test(e.dataTransfer.files[0].name)){
      if(document.getElementById('upload_path')){
        document.getElementById('upload_path').innerHTML = "Loading...";
      }
      if(window.FileReader){
        var fr = new FileReader();
        fr.readAsDataURL(e.dataTransfer.files[0]);
        fr.onload = function(e){
          document.getElementById("drag_area").innerHTML = "";
          var img = document.createElement("img");
          img.src = e.target.result;
          document.getElementById("drag_area").appendChild(img);
        };
      } else {
        console.log("Your browser doesn't support fileReader.")
      }
    }
  });

  dragArea.addEventListener("dragover", function(e){
    e = e || window.event;
    e.preventDefault();
    e.returnValue = false;
    e.stopPropagation();
    e.cancelBubble = true;
  });





}());