import { DefaultLoadingManager } from "three";
import myWorld from "./client.js"

var accumulative_data = [[],[],[]]
var timeline = []
function makeAccGraph(){
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: timeline,
          datasets: [{ 
              data: accumulative_data[0],
              label: "predator",
              borderColor: "#3e95cd",
              fill: false
            }, { 
              data: accumulative_data[1],
              label: "prey",
              borderColor: "#8e5ea2",
              fill: false
            }, { 
              data: accumulative_data[2],
              label: "food",
              borderColor: "#3cba9f",
              fill: false
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: '시간이 지남에 따른 개체수 변화'
          },
          ticks:{
            beginAtZero: true,
            min: 0,
            max: 5,
            setpSize:1
          }
        }
      });
}

function makeCurGraph(){
  let food_num = 0
    for(let i = 0 ;i<myWorld.size ; i++){
        for(let j =0 ; j<myWorld.size ;j++){
            food_num += Number(myWorld.foodMap[i][j])
        }
    }
  new Chart(document.getElementById("cur-chart").getContext("2d"), {
        type: 'pie',
        data: {
          labels: ["predator", "prey","food"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
            data: [myWorld.predator.length,myWorld.prey.length,food_num]
          }]
        },
        options: {
          title: {
            display: true,
            text: '현재 종족에 따른 개체수'
          }
        }
    });
}
function stack_data(){
    let food_num = 0
    for(let i = 0 ;i<myWorld.size ; i++){
        for(let j =0 ; j<myWorld.size ;j++){
            food_num += Number(myWorld.foodMap[i][j])
        }
    }
    accumulative_data[0].push(myWorld.predator.length)
    accumulative_data[1].push(myWorld.prey.length)
    accumulative_data[2].push(food_num)
    timeline.push("")
}
// 특정 grid의 개체 평균 특성 오각형으로 표시
function makeCharGragh(gridNum){
  let preyCharAvg     = [0,0,0,0,0]
  let predatorCharAvg = [0,0,0,0,0]
  let preyNum      = 0
  let predactorNum = 0
  for(let i = parseInt(gridNum/4)*parseInt(myWorld.size/4) ; i< (parseInt(gridNum/4)+1)*parseInt(myWorld.size/4) ; i++){
    for(let j = (gridNum%4)*parseInt(myWorld.size/4); j< ((gridNum%4)+1)*parseInt(myWorld.size/4); j++){
      for(var c of myWorld.creatures[i][j]){
        if(c.type == 1){
          preyNum += 1
          preyCharAvg[0] += c.speed
          preyCharAvg[1] += c.sight
          preyCharAvg[2] += c.coldresist
          preyCharAvg[3] += c.hotresist
          preyCharAvg[4] += c.efficiency
        }
        if(c.type == 2){
          predactorNum += 1
          predatorCharAvg[0] += c.speed
          predatorCharAvg[1] += c.sight
          predatorCharAvg[2] += c.coldresist
          predatorCharAvg[3] += c.hotresist
          predatorCharAvg[4] += c.efficiency
        }
      }
    }
  } 
  for(let i=0; i<5;i++){
    preyCharAvg[i]     = preyCharAvg[i] / preyNum
    predatorCharAvg[i] = predatorCharAvg[i] / predactorNum
  }
  new Chart(document.getElementById("char-chart"), {
    type: 'radar',
    data: {
      labels: ["속도", "시야", "추위저항성", "고온저항성", "연비"],
      datasets: [
        {
          label: "포식자",
          fill: true,
          backgroundColor: "rgba(179,181,198,0.2)",
          borderColor: "rgba(179,181,198,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(179,181,198,1)",
          data: predatorCharAvg
        }, {
          label: "피식자",
          fill: true,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          data: preyCharAvg
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'grid ""의 평균 특성'
      }
    }
});
}

export {makeAccGraph,stack_data,makeCurGraph,makeCharGragh}