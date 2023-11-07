'use strict';
import chart from "./Chart.js";
import * as d3 from "d3";
import csv from "./assets/statistics.csv";

d3.csv(csv).then((data, error) => { 
  if (error) {
    console.log(error);
  } else {
    //console.log(data);
    data.forEach(d => {
      d.Date = new Date(d.Date);//将日期转化为Date对象
      d.Class = +(d.Class);//将字符串转化为数字
      d.SelfLearning = +(d.SelfLearning);
      d.Entertainment = +(d.Entertainment);
      d.Sleeping = +(d.Sleeping);
      d.Others = +(d.Others);
    });
    chart(data,{})
   };
}); 