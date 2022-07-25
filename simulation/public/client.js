import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
// import {Chart} from 'chart.js/auto'
import { Loader } from 'three'
import World from './world.js' 
import Creature from './creature.js' 
// import {makeChart,updateChart} from './chart.js'


// =============== RENDERER ===================
const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// =============== SCENE ======================
const scene = new THREE.Scene()

// =============== CAMERA =====================
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1500)
camera.position.set(0, 370, 340)
camera.lookAt(0,0,0)

// ==================== ORBITCONTROL =========================
const controls = new OrbitControls(camera, renderer.domElement)

// ===================== LIGHT ========================
const light = new THREE.DirectionalLight(0xffffff, 1.5)
light.position.copy( camera.position );
light.castShadow = true
light.receiveShadow = true
scene.add(light)
scene.add(light.target)

// =================== PLANE =========================
const planeGeometry = new THREE.PlaneGeometry(300,300)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xE4AE5B,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5*Math.PI
plane.receiveShadow = true

// // =================== ENV GLTF (TODO: should remove and module)===
// const loader = new GLTFLoader();
// const iceURL = new URL('./assets/ground.glb', import.meta.url)
// let backgorund
// loader.load(iceURL.href, function(gltf){
//     backgorund = gltf.scene
//     backgorund.rotation
//     backgorund.scale.set(50, 10, 50)
//     backgorund.position.z = 30
//     backgorund.position.x = 10
//     backgorund.castShadow = true
//     backgorund.receiveShadow = true
//     scene.add(backgorund)
// })


// ================== MAIN LOOP 1 ========================
const myWorld = new World(scene, 100, 10)
console.log("=====world creation done=====")

//create adam and eve
let isfarsighted = true

console.log("=====creature creation done=====")

// create food
myWorld.foodInit()
console.log("=====food creation done=====")
console.log(myWorld.prey[0])
var basic_frame = 60
var target_frame = 5
var frame = 0
let animateId

function animate() {
    animateId= requestAnimationFrame(animate)
    light.position.copy( camera.position );
    if(frame > basic_frame){
        frame -= basic_frame
        // set farsighted & closesighted
        const dist = Math.sqrt((camera.position.x*camera.position.x) + (camera.position.y*camera.position.y) + (camera.position.z*camera.position.z))
        if(dist > 400)
            isfarsighted = true
        else
            isfarsighted = false
    
        // creatures move
        
        myWorld.day(isfarsighted)
        if(myWorld.turn%30==0){
            myWorld.yearOver(isfarsighted)
            updateChart()
        }
    }
    
    render() 
    frame += target_frame
    
}
 
function render() {
    renderer.render(scene, camera)
}
animate()


window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

var creatureBtn = document.getElementById('creatureBtn')
var creatureDialog = document.getElementById('creatureDialog')

creatureBtn.addEventListener('click', function onOpen(){
    if (typeof creatureDialog.showModal === 'function') {
        creatureDialog.showModal()
    }else {
        alert("the dialog api is not supported by this browser")
    }
})


var creatureBtn = document.getElementById('creatureBtn')
var creatureDialog = document.getElementById('creatureDialog')
var previewBtn = document.getElementById('previewBtn')
var confirmBtn = document.getElementById('confirmBtn')
var cancelBtn = document.getElementById('cancelBtn')
var gridmapC = document.getElementById('gridmapContainer')
let gridmaps = document.getElementsByClassName('grid-item')
let gridmapList = Array.prototype.slice.call(gridmaps)


creatureBtn.addEventListener('click', function onOpen(){
    cancelAnimationFrame(animateId)
})
cancelBtn.addEventListener('click', function(){
    animate()
    let input = document.getElementsByTagName('input')
    let inputList = Array.prototype.slice.call(input)
    inputList.forEach(elem => {
        elem.checked = false
        elem.value = null
    }) //.value = null
    
    gridmapC.style.display = "none"
    creatureDialog.close('creatureNotChosen')
})

confirmBtn.addEventListener('click', function(){
    // gridmap 보여주고 클릭 받기 !!!!
    // 1. 지정된 인풋 파라미터에 불러오기
    // 1-1. 모두 다 null이 아님을 확인하기.
    // 2. 파라미터 전역적으로 지정해서 다른 클릭에서 사용할 수 있도록 하기
    // 3. gridmap 켜기(맵의 크기는 일정.거기서 상대적으로 위치를 얻어야 함.
    // 4. 각 꼭짓점의
    gridmapC.style.display = "block"
})

previewBtn.addEventListener('click', function(){
    // TODO: input 스탯 받아서 적절한 애로 보여주기
})

gridmapList.forEach(grid => {
    grid.addEventListener('click', function(){
        let gridpos = getOffset(grid)
        console.log(gridpos)
    })
})

function getOffset(el){
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY
    }
}

function updateChart(){


    new Chart(document.getElementById("line-chart").getContext("2d"), {
        type: 'pie',
        data: {
          labels: ["predator", "prey"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2",],
            data: [myWorld.predator.length,myWorld.prey.length]
          }]
        },
        options: {
          title: {
            display: false,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });
}

