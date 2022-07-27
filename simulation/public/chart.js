import { DefaultLoadingManager } from "three";
import myWorld from "./client.js"

var accumulative_data = [[],[],[]]
var timeline = []
var curGragh1 = null
var curGragh2 = null
var curGragh3 = null


function makeCurGraph(){
  let food_num = 0
  for(let i = 0 ;i<myWorld.size ; i++){
    for(let j =0 ; j<myWorld.size ;j++){
      food_num += Number(myWorld.foodMap[i][j])
    }
  }


  if( curGragh1 != null){
    curGragh1.data.datasets[0].data = [myWorld.predator.length, myWorld.prey.length, food_num]
    console.log([myWorld.predator.length, myWorld.prey.length, food_num])
    curGragh1.update()
  }
  else{
    curGragh1 = new Chart(document.getElementById("cur-chart"), {
      type: 'pie',
      data: {
        labels: ["predator", "prey","food"],
        datasets: [{
          label: "Population",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
          data: [myWorld.predator.length, myWorld.prey.length, food_num]
        }]
      },
      options: {
        title: {
          display: true,
          text: '현재 종족에 따른 개체수',
          fontSize: 20
        }
      }
  });
  }
}

function makeAccGraph(){
  if(curGragh2 != null){
    curGragh2.data.datasets[0].data = accumulative_data[0]
    curGragh2.data.datasets[1].data = accumulative_data[1]
    curGragh2.data.datasets[2].data = accumulative_data[2]

    curGragh2.update()
  }
  else{
    curGragh2 = new Chart(document.getElementById("line-chart"), {
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
          text: '시간이 지남에 따른 개체수 변화',
          fontSize: 20
        },
        
      }
    });
  }  
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
        else if(c.type == 2){
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
    if( preyNum != 0){preyCharAvg[i]     = preyCharAvg[i] / preyNum}
    if( predactorNum !=0 ){predatorCharAvg[i] = predatorCharAvg[i] / predactorNum}
  }
  preyCharAvg[1] /=2
  predatorCharAvg[1] /=2
  console.log(preyCharAvg , predatorCharAvg)
  if(curGragh3 != null){
    curGragh3.data.datasets[0].label = "포식자 (" + predactorNum + " 마리)"
    curGragh3.data.datasets[0].data  = predatorCharAvg

    curGragh3.data.datasets[1].label = "피식자 (" + preyNum + " 마리)"
    curGragh3.data.datasets[1].data  = preyCharAvg

    curGragh3.options.title.text = "grid "+(gridNum+1) +"의 평균 특성"
    curGragh3.update()
  }
  else{
    curGragh3 = new Chart(document.getElementById("char-chart"), {
    type: 'radar',
    data: {
      labels: ["속도", "시야", "추위저항성", "고온저항성", "연비"],
      datasets: [
        {
          label: "포식자 (" + predactorNum + " 마리)",
          fill: true,
          backgroundColor: "rgba(155,0,0,0.2)",
          borderColor: "rgba(255,0,0,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(255,0,0,1)",
          data: predatorCharAvg
        }, {
          label: "피식자 (" + preyNum + " 마리)",
          fill: true,
          backgroundColor: "rgba(0,0,155,0.2)",
          borderColor: "rgba(0,0,255,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(0,0,155,1)",
          pointBorderColor: "#fff",
          data: preyCharAvg
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "grid "+(gridNum+1) +"의 평균 특성",
        fontSize: 20
      },
      scale:{
          ticks:{
            beginAtZero: true,
            min: 0,
            max: 5,
            stepSize: 1
          }
      }
    }
  
});
}
}

export {makeAccGraph,stack_data,makeCurGraph,makeCharGragh}