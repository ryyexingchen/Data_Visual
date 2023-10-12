  // 改变标题背景的格式并显示当前时间
  setInterval(function(){
    // 设置当前时间
    var date = new Date()
    date.setTime(Date.now())
    document.getElementById("time").textContent = date
    // 设置背景颜色
    if(date.getHours()>=6 && date.getHours() < 18){
    document.getElementById("titleBG").className = "day"
    }else{
    document.getElementById("titleBG").className = "night"
    }
},1000)