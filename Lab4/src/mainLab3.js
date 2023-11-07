'use strict';
import chart from "./Lab3.js";
import * as d3 from "d3";
import csv from "./assets/Women's 10m Platform Final.csv";

d3.csv(csv).then((data, error) => { 
  if (error) {
    console.log(error);
  } else {
    //console.log(data);
    data.forEach(d => {
      d.Round = +(d.Round);//将字符串转化为数字
      d.LoKaWai = +(d.LoKaWai);
      d.YelizavetaDAROVSKAYA = +(d.YelizavetaDAROVSKAYA);
      d.PandalelaRinongANAKPAMG = +(d.PandalelaRinongANAKPAMG);
      d.MOONNayun = +(d.MOONNayun);
      d.CHOEunbi = +(d.CHOEunbi);
      d.ARAIMatsuri = +(d.ARAIMatsuri);
      d.CHENYuxi = +(d.CHENYuxi);
      d.QUANHongchan = +(d.QUANHongchan);
    });
    chart(data,{})
   };
}); 