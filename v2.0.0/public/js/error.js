    var canvas = document.createElement('canvas');
    console.log(error.status);
    // var canvas = document.getElementById('status');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.font = "30px Verdana";
    ctx.fillText(error.status, 10, 10);

    //- var particles = new Particles({
    //-   canvasId: "logo",
    //-   imgUrl: 'url',
    //-   cols: 100,
    //-   rows: 100,
    //-   startX: 50,
    //-   startY: -100,
    //-   imgX: 500,
    //-   imgY:600,
    //-   delay: 100,
    //-   duration: 2000,
    //-   interval: 6,
    //-   fillStyle: 'rgba(26,145,211,.9)',
    //-   particleOffset: 2,
    //-   ease: 'easeInOutBack'
    //- }).animate();
