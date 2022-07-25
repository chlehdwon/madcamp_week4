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
const PLANESIZE = 300
const planeGeometry = new THREE.PlaneGeometry(PLANESIZE,PLANESIZE)
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
const myWorld = new World(scene, 0, 0)
console.log("=====world creation done=====")

//create adam and eve
let isfarsighted = true

console.log("=====creature creation done=====")

// create food
myWorld.foodInit()
console.log("=====food creation done=====")
console.log(myWorld.prey[0])
var basic_frame = 60
var target_frame = 15
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
        if(myWorld.turn%365==0){
            myWorld.monthOver(isfarsighted)
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
let gridConfirmBtn = document.getElementById('gridConfirmBtn')


creatureBtn.addEventListener('click', function onOpen(){
    cancelAnimationFrame(animateId)
})


let newCreatureP
let newPreyList
let newPredetorList
let newCid
let typeColor = [0x000000, 0x0000FF,0xFF0000] // for visualizing click

cancelBtn.addEventListener('click', function(){
    newPredetorList.forEach((elem)=>{
        scene.remove(elem.object)
    })
    newPreyList.forEach((elem) => {
        scene.remove(elem.object)
    })
    initCreatureD() // 이거 꼭 위에코드 다음에 실행되어야 함!!!
    animate()
    gridmapC.style.display = "none"
    creatureDialog.close('creatureNotChosen')
})

confirmBtn.addEventListener('click', function(){
    newPreyList = []
    newPredetorList = []
    newCid = myWorld.cid

    let ctype
    if(document.getElementById('prey').checked){
        ctype = 1;
    } else if(document.getElementById('predetor').checked){
        ctype = 2;
    } else{
        alert("타입을 선택해 주세요.")
        return
    }
    newCreatureP = {
        scene: scene,
        type : ctype,
        worldSize : PLANESIZE,
        speed : parseInt(document.getElementById('speed').value),
        sight : parseInt(document.getElementById('sight').value),
        coldresist : parseInt(document.getElementById('cold').value),
        hotresist : parseInt(document.getElementById('hot').value),
        efficiency : parseInt(document.getElementById('eff').value),
        isfarsighted : isfarsighted
    }
    console.log(newCreatureP)
    gridmapC.style.display = "block"
})

previewBtn.addEventListener('click', function(){
    // TODO: input 스탯 받아서 적절한 애로 보여주기
})

gridmapList.forEach(grid => {
    grid.addEventListener('click', function(event){
        let gridpos = getOffset(grid)
        const absoluteX = gridpos.right - gridpos.left
        const absoluteY = gridpos.bottom - gridpos.top
        const singleGridCount = PLANESIZE/4  // gridcount X gridcount 
        const scaleX = singleGridCount/absoluteX
        const scaleY = singleGridCount/absoluteY
        const xi = parseInt(event.target.id[0])
        const yi = parseInt(event.target.id[1])

        // worldsize == planesize라 가정.
        const inputX = event.clientX - gridpos.left
        const inputY = event.clientY - gridpos.top

        // draw preview dot
        let cwidth = event.target.width
        let cheight = event.target.height
        let scaleX_c = cwidth/absoluteX
        let scaleY_c = cheight/absoluteY
        let ctx = event.target.getContext('2d')
        ctx.beginPath()
        ctx.arc(parseInt(inputX*scaleX_c), parseInt(inputY*scaleY_c), 2, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fillStyle = typeColor[newCreatureP.type]
        ctx.fill()

        newCreatureP.x = parseInt(xi*singleGridCount + inputX*scaleX)
        newCreatureP.z = parseInt(yi*singleGridCount + inputY*scaleY)
        newCreatureP.id = newCid
        if (newCreatureP.type == 1){    // prey
            newPreyList.push(new Creature(newCreatureP))
        } else if (newCreatureP.type == 2){     // predetor
            newPredetorList.push(new Creature(newCreatureP))
        } else{
            console.log("wrong type input!!!")
        }
        newCid++
    })
})

gridConfirmBtn.addEventListener('click', function(){
    myWorld.prey = myWorld.prey.concat(newPreyList)
    myWorld.predator = myWorld.predator.concat(newPredetorList)
    
    initCreatureD()
    animate()
    render()
    
    gridmapC.style.display = "none"
    creatureDialog.close('creaturesConfirmed')
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

function initCreatureD(){
    newPredetorList = []
    newPreyList = []
    let input = document.getElementsByTagName('input')
    let inputList = Array.prototype.slice.call(input)
    inputList.forEach(elem => {
        elem.checked = false
        elem.value = null
    }) 
    gridmapList.forEach(grid => {
        grid.width = grid.width // canvas 초기화
    })
}

let framecount = document.getElementById("framecount")
let pauseBtn = document.getElementById("pause")
let playBtn = document.getElementById("aniplay")
let frameNum = document.getElementById('frameNum')

pauseBtn.addEventListener('click', function(){
    cancelAnimationFrame(animateId)
})
playBtn.addEventListener('click', function(){
    animate()
})
framecount.addEventListener('input', function(){
    cancelAnimationFrame(animateId)
    frameNum.innerHTML = framecount.value
    target_frame = parseInt(framecount.value)
    animate()
}, false)