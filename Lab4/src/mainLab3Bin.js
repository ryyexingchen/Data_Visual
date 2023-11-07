'use strict';
import bin from "./Lab3Bin.js";
import * as d3 from "d3";
import csv from "./assets/Women's Points.csv";

d3.csv(csv).then((data, error) => { 
  if (error) {
    console.log(error);
  } else {
    //console.log(data);
    data.forEach(d => {
        d.Round1 = +(d.Round1);//将字符串转化为数字
        d.Round2 = +(d.Round2);
        d.Round3 = +(d.Round3);
        d.Round4 = +(d.Round4);
        d.Round5 = +(d.Round5);
        d.Difficulty = +(d.Difficulty);
    });
    bin(data,{})
   };
}); 