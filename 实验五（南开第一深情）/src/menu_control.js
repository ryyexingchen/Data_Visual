var selectElement = document.getElementById('eq');
var lastValue = "2011";
document.getElementById("2004").hidden = true;
document.getElementById("2011").hidden = false;
document.getElementById("2016_1").hidden = true;
document.getElementById("2016_2").hidden = true;
document.getElementById("2018").hidden = true;
document.getElementById("2023").hidden = true;
selectElement.onchange = function(){
    document.getElementById(lastValue).hidden = true;
    lastValue = this.value;
    document.getElementById(this.value).hidden = false;
}
