 //获得画布
 var canvas = document.querySelector('#tlt3');
 var ctx = canvas.getContext('2d'); //获得上下文
 canvas.width = window.innerWidth; //设置标签的属性宽高
 canvas.height = 100; 
 //添加渐变线
 var grd = ctx.createLinearGradient(100,300,700,300);
 //添加颜色断点
 grd.addColorStop(0,"#6ff");
 grd.addColorStop(0.5,"#6cf")
 grd.addColorStop(1,"blue");
 //应用渐变
 ctx.fillStyle = grd;
 ctx.strokeStyle = grd;
 //画矩形
 ctx.fillRect(45,80,1600,10);
 ctx.fillStyle = "#6f6";
 ctx.strokeStyle = "#6f6";
 //画圆
 ctx.arc(50,50,50,0,2*Math.PI);
 ctx.fill();
  //写字
 ctx.fillStyle = "#000";
 ctx.strokeStyle = "#000";
 ctx.font = "50px Times New Roman";
 ctx.fillText("03",25,67);
 ctx.font = "700 50px 幼圆";
 ctx.fillText("线路选择的原因",window.innerWidth/2 - 100,70);