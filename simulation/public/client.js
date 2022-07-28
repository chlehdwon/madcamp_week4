import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
// import {Chart} from 'chart.js/auto'
import { Loader} from 'three'
import World from './world.js' 
import Creature from './creature.js' 
import {makeAccGraph,stack_data,makeCurGraph,makeCharGragh} from './chart.js'
import {Jungle, Desert, Glacier, Grass} from './env.js'


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
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000)
camera.position.set(0, 500, 3000)
camera.lookAt(0,0,0)

// ==================== ORBITCONTROL =========================
var controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener( 'change', render )
controls.minPolarAngle = -Math.PI/2
controls.maxPolarAngle =  Math.PI / 2 - 0.05;
controls.minDistance=0
controls.maxDistance= 9000

// ===================== LIGHT ========================
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.copy( camera.position );
light.castShadow = true
light.receiveShadow = true
scene.add(light)
scene.add(light.target)



// =================== World ========================
const myWorld = new World(scene,30,30)
console.log("=====world creation done=====")

// =================== PLANE =========================

var desertTexture = new THREE.TextureLoader().load("./assets/desert_texture.jpg")
var glacierTexture = new THREE.TextureLoader().load("./assets/glacier_texture.jpg")
var grassTexture = new THREE.TextureLoader().load("./assets/grass_texture.jpg")
var jungleTexture = new THREE.TextureLoader().load("./assets/jungle_texture.jpg")
var lightningTexture = new THREE.TextureLoader().load("./assets/lightning_texture.jpg")
var meteorTexture = new THREE.TextureLoader().load("./assets/meteor_texture.jpg")

const textures = [grassTexture, jungleTexture, desertTexture, glacierTexture]
const textureUrl = ['assets/grass_texture.jpg', 'assets/jungle_texture.jpg', 'assets/desert_texture.jpg', 'assets/glacier_texture.jpg']

const PLANESIZE = myWorld.size
let planeList = []
for(var i=0; i<4; i++){
    for(var j=0; j<4; j++){
        const planeGeometry = new THREE.PlaneGeometry(PLANESIZE/4,PLANESIZE/4)
        var planeMaterial = new THREE.MeshBasicMaterial({
            map: textures[myWorld.envs[i*4+j].textureIdx],
            side: THREE.DoubleSide
        })
        
        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        scene.add(plane)
        plane.rotation.x = -0.5*Math.PI
        plane.position.x = -(PLANESIZE/8*3) + (j * PLANESIZE/4)
        plane.position.z = -(PLANESIZE/8*3) + (i * PLANESIZE/4)
        plane.receiveShadow = true
        planeList.push({plane:plane, type:myWorld.envs[i*4+j].textureIdx})
    }
}



// =================== ENV GLTF (TODO: should remove and module)===
const loader = new GLTFLoader();
const islandURL = new URL('./assets/island.glb', import.meta.url)
let backgorund
loader.load(islandURL.href, function(gltf){
    backgorund = gltf.scene
    backgorund.rotation
    backgorund.scale.set(85, 100, 85)
    backgorund.position.z = 15
    backgorund.position.x = -30
    backgorund.position.y = -666
    backgorund.castShadow = true
    backgorund.receiveShadow = true
    scene.add(backgorund)
})

// ================== FOR GRAGH ========================
var graghType = 0
var gragh1_click = 0
var gragh2_click = 0
var gragh3_click = 0
var search_grid  = 0

// ================== MAIN LOOP 1 ========================

//create adam and eve
let isfarsighted = true

console.log("=====creature creation done=====")

// create food
myWorld.foodInit()
console.log("=====food creation done=====")

var basic_frame = 60
var target_frame = 15
var frame = 0
let animateId
let particles
let recover=0
let dday = document.querySelector("#dday")
let age = document.querySelector("#calender")
var date = new Date()
date.setFullYear(0)
date.setMonth(0)
date.setDate(1)

function animate() {
    animateId= requestAnimationFrame(animate)
    light.position.copy( camera.position );
    if(frame > basic_frame){
        dday.innerHTML = "D+"+myWorld.turn
        age.innerHTML = getYMD()
        date.setDate(date.getDate()+1)
        frame -= basic_frame
        // set farsighted & closesighted
        const dist = Math.sqrt((camera.position.x*camera.position.x) + (camera.position.y*camera.position.y) + (camera.position.z*camera.position.z))
        if(dist > 1300)
            isfarsighted = true
        else
            isfarsighted = false

        // graghData get
        if(myWorld.turn%20==0){
            stack_data()
        }

        // set IceAge
        if(myWorld.isIceAge > 0){
            snowing()
        }else{
            scene.remove(particles)
        }

        if(myWorld.lightning > myWorld.turn){
            vibrateCamera()
        }

        if(myWorld.meteor > myWorld.turn){
            vibrateCamera()
        }

        // creatures move
        myWorld.day(isfarsighted)
        if(recover == 1){
            planeList.forEach((_, idx)=>{
                console.log(planeList[idx].type)
                planeList[idx].plane.material.map = textures[planeList[idx].type]
            })
        }
        recover -= 1
        if(myWorld.turn%365==0){
            myWorld.age += 1
            myWorld.yearOver(isfarsighted)

            if(graghType==1){
                makeCurGraph()
            }
            else if(graghType ==2){
                makeAccGraph()
            }
            else if(graghType ==3){
                makeCharGragh(search_grid)
            }

            
        }

    }
    render() 
    frame += target_frame
}
 
function render() {
    renderer.render(scene, camera)
}
animate()

function getYMD(){
    var year = date.getFullYear()

    return "서기 " + year + "년"
}


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

// ==================== CreatureCreate =======================
var creatureBtn = document.getElementById('creatureBtn')
var creatureDialog = document.getElementById('creatureDialog')
let previewImg = document.querySelector('#preview')
var previewBtn = document.getElementById('previewBtn')
var confirmBtn = document.getElementById('confirmBtn')
var cancelBtn = document.getElementById('cancelBtn')
var gridmapC = document.getElementById('gridmapContainer')
let gridmaps = document.getElementsByClassName('grid-item')
let gridmapList = Array.prototype.slice.call(gridmaps)
let gridConfirmBtn = document.getElementById('gridConfirmBtn')

creatureBtn.addEventListener('click', function onOpen(){
    if (typeof creatureDialog.showModal === 'function') {
        creatureDialog.showModal()
    }else {
        alert("the dialog api is not supported by this browser")
    }
    cancelAnimationFrame(animateId)
})

let newCreatureP
let newPreyList = []
let newPredetorList = []
let newCid
let typeColor = [0x000000, 0x0000FF,0xFF0000] // for visualizing click
let errmsg = document.querySelector('.errorMsg')

let input = document.getElementsByClassName('creatureInput')
let speedP = document.querySelector('#speedP')
let sightP = document.querySelector('#sightP')
let coldP = document.querySelector('#coldP')
let hotP = document.querySelector('#hotP')
let effP = document.querySelector('#effP')
let outputList = [speedP, sightP, coldP, hotP, effP]

let inputList = Array.prototype.slice.call(input)
inputList.forEach((elem, idx) => {
    if(idx == 0 || idx == 1){}
    else{
        console.log(elem)
        elem.addEventListener('input', function(e){
            outputList[idx-2].innerHTML = e.target.value
        })
    }
}) 

creatureBtn.addEventListener('click', function onOpen(){
    if (typeof creatureDialog.showModal === 'function') {
        gridmapList.forEach((grid, idx)=>{
            grid.style.backgroundImage = `url(${textureUrl[planeList[idx].type]})`
        })
        creatureDialog.showModal()
    }else {
        alert("the dialog api is not supported by this browser")
    }
    cancelAnimationFrame(animateId)
})

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
        errmsg.style.display = 'block'
        errmsg.innerHTML = "Please select the creature type"
        return
    }
    
    let speed = parseInt(document.getElementById('speed').value)
    let sight = parseInt(document.getElementById('sight').value)
    let coldresist = parseInt(document.getElementById('cold').value)
    let hotresist = parseInt(document.getElementById('hot').value)
    let efficiency = parseInt(document.getElementById('eff').value) 

    if(speed + sight + coldresist + hotresist + efficiency > 15){
        errmsg.style.display = 'block'
        errmsg.innerHTML = "Sum of performance should be below 15."
        return
    }
    errmsg.style.display = 'none'
    confirmBtn.style.display = 'none'
    newCreatureP = {
        scene: scene,
        type : ctype,
        worldSize : PLANESIZE,
        speed : parseInt(document.getElementById('speed').value),
        sight : parseInt(document.getElementById('sight').value)*2,
        coldresist : parseInt(document.getElementById('cold').value),
        hotresist : parseInt(document.getElementById('hot').value),
        efficiency : parseInt(document.getElementById('eff').value),
        isfarsighted : isfarsighted
    }
    console.log(newCreatureP)
    gridmapC.style.display = "block"
})

previewBtn.addEventListener('click', function(){
    let input = document.getElementsByClassName('creatureInput')
    let inputList = Array.prototype.slice.call(input)
    let type
    if (inputList[0].checked)    type="prey"
    else if (inputList[1].checked)    type="predetor"
    else {
        previewImg.style.backgroundImage = (`url(assets/createbtn.jpg)`)
        return
    } 
    let cold = inputList[4].value
    let hot = inputList[5].value
    previewImg.style.backgroundImage = (`url(assets/preview/${type}_${cold}${hot}_img.png)`)
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
        ctx.fillRect(parseInt(inputX*scaleX_c), parseInt(inputY*scaleY_c), 10, 5)

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


function initCreatureD(){
    confirmBtn.style.display = 'inline'
    newPredetorList = []
    newPreyList = []
    let input = document.getElementsByClassName('creatureInput')
    let inputList = Array.prototype.slice.call(input)
    inputList.forEach(elem => {
        elem.checked = false
        elem.value = null
    }) 
    previewImg.style.backgroundImage = (`url(assets/createbtn.jpg)`)
    gridmapList.forEach(grid => {
        grid.width = grid.width // canvas 초기화
    })
    outputList.forEach(elem => {
        elem.innerHTML = 3
    })
    errmsg.style.display = 'none'
}
// ======================================================


// ====================== Envs ===========================
let envBtn = document.getElementById("envBtn")
let envDialog = document.getElementById('envDialog')
const envGrids = document.querySelectorAll('.grid-item-env')
let envCancel = document.querySelector('#envCancel')
let envConfirm = document.querySelector('#envConfirm')

envGrids.forEach(grid=>{
    grid.addEventListener('dragenter', dragEnter)
    grid.addEventListener('dragover', dragOver)
    grid.addEventListener('dragleave', dragLeave)
    grid.addEventListener('drop', drop)
})
function dragEnter(e) {
    e.target.classList.add('drag-over');
}
function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}
let newEnvList = Array(16).fill(null)
function drop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    const targetid = e.target.id
    // get the draggable element
    const data = e.dataTransfer.getData('text/html')
    const imgid = data.substring(data.indexOf("id=")+4, data.indexOf(" draggable")-1)
    const imgurl = e.dataTransfer.getData('text');

    // add it to the drop target
    // console.log(e.target.id)
    e.target.style.backgroundImage = `url(${imgurl})`
    newEnvList[parseInt(targetid[0]) + parseInt(targetid[1])*4] = imgid
}
envBtn.addEventListener('click', function onOpen(){
    if (typeof envDialog.showModal === 'function') {
        envGrids.forEach((grid, idx)=>{
            // console.log(textureUrl[planeList[idx].type])
            grid.style.backgroundImage = `url(${textureUrl[planeList[idx].type]})`
        })
        envDialog.showModal()
    }else {
        alert("the dialog api is not supported by this browser")
    }
    cancelAnimationFrame(animateId)
})
envCancel.addEventListener('click', function(){
    envDialog.close('no env chosen')
    animate()
})
envConfirm.addEventListener('click', function(){
    // 여기서 tile type 설정
    console.log("Called!")
    newEnvList.forEach((id, idx) =>{
        console.log(id)
        if(id == "grass"){
            myWorld.envs[idx] = new Grass()
            planeList[idx].plane.material.map = grassTexture
            planeList[idx].type = 0
        } else if(id == "jungle"){
            myWorld.envs[idx] = new Jungle()
            planeList[idx].plane.material.map = jungleTexture
            planeList[idx].type = 1
        } else if(id == "desert"){
            myWorld.envs[idx] = new Desert()
            planeList[idx].plane.material.map = desertTexture
            planeList[idx].type = 2
        }else if(id == "glacier"){
            myWorld.envs[idx] = new Glacier()
            planeList[idx].plane.material.map = glacierTexture
            planeList[idx].type = 3
        }
    })
    newEnvList = Array(16).fill(null)
    envDialog.close('env chosen')
    console.log(myWorld.envs)
    animate()
})
// =======================================================


// ================ Disasters ============================
let disasterBtn = document.getElementById("disasterBtn")
let disasterDialog = document.getElementById('disasterDialog')
let lightningBtn = document.getElementById('lightningBtn')

var gridmapLightning = document.getElementById('gridmapLightning')
let gridmaps_small = document.getElementsByClassName('grid-item-small')
let gridmapSmallList = Array.prototype.slice.call(gridmaps_small)

let meteorBtn = document.getElementById('meteorBtn')
let iceAgeBtn = document.getElementById('iceAgeBtn')
let globalWarmingBtn = document.getElementById('globalWarmingBtn')
let disasterCancel = document.getElementById('disasterCancel')

disasterBtn.addEventListener('click', function onOpen(){
    if (typeof disasterDialog.showModal === 'function') {
        gridmapSmallList.forEach((grid, idx)=>{
            grid.style.backgroundImage = `url(${textureUrl[planeList[idx].type]})`
        })
        disasterDialog.showModal()
    }else {
        alert("the dialog api is not supported by this browser")
    }
    cancelAnimationFrame(animateId)
})

disasterCancel.addEventListener('click', function(){
    gridmapLightning.style.display = "none"
    disasterDialog.close('no disaster chosen')
    animate()
})

// lightning
lightningBtn.addEventListener('click', function (){
    gridmapLightning.style.display = "block"
})
gridmapSmallList.forEach((tileElem) => {
    tileElem.addEventListener('click', function(e){
        gridmapLightning.style.display = "none"
        disasterDialog.close('lightning confirmed')
        lightning(e.target.id)
    })
})
meteorBtn.addEventListener('click', function(){
    disasterDialog.close('meteor confirmed')
    meteor()
})
globalWarmingBtn.addEventListener('click', function(){
    disasterDialog.close('global warming confirmed')
    globalWarming()
})
iceAgeBtn.addEventListener('click', function(){
    disasterDialog.close('ice age confirmed')
    iceAge()
})
function lightning(tile){
    // tile input should be 00 01 ...
    if(myWorld.turn < myWorld.lightning + 365){
        console.log('Disaster Failed')
        animate()
    }
    else{
        cancelAnimationFrame(animateId)
        console.log(`Disaster: Lightning on ${tile}`)
        let tileleft = parseInt(tile[0])*PLANESIZE/4    //x
        let tileright = tileleft + PLANESIZE/4          //x
        let tiletop = parseInt(tile[1])*PLANESIZE/4     //z
        let tilebtm = tiletop + PLANESIZE/4             //z
        for(let i=tiletop; i<tilebtm; i++){
            for(let j=tileleft; j<tileright; j++){
                myWorld.creatures[i][j].forEach((creature)=>{
                    myWorld.predator = myWorld.predator.filter((element)=>element.object!==creature.object);
                    myWorld.prey = myWorld.prey.filter((element)=>element.object!==creature.object);
                    scene.remove(creature.object)
                })
                myWorld.creatures[i][j] = []    // remove all creatures from the position.
                if(myWorld.foodDict[[i,j]] != null){
                    scene.remove(myWorld.foodDict[[i,j]].mesh)
                    myWorld.foodMap[i][j] = 0
                    myWorld.foodDict[[i,j]] = null;
                }
            }
        }
        myWorld.lightning = myWorld.turn+3
        myWorld.envs[parseInt(tile[0]) + parseInt(tile[1])*4].isDamaged = 365    // damaged for 1month
        
        planeList[parseInt(tile[0])+parseInt(tile[1])*4].plane.material.map = lightningTexture
        recover=365
        animate()
    }
}



function vibrateCamera(){
    camera.lookAt(new THREE.Vector3(0,-10,0))
    setTimeout(restoreCamera, 20)
}

function restoreCamera(){
    camera.lookAt(new THREE.Vector3(0,0,0))
}


function meteor(){
    // grid 절반을 날려버림. 날려버릴 grid는 랜덤선택
    if(myWorld.turn < myWorld.meteor + 365*3){
        console.log('Disaster Failed')
        animate()
    }
    else{
        const tileIdArray = ["00","10","20","30","01","11","21","31","02","12","22","31","03","13","23","33"]
        let selectedTile = []
        for (let i=0; i<8; i++){
            let newElem = tileIdArray[Math.floor(Math.random() * 16)]
            while(selectedTile.includes(newElem)){
                newElem = tileIdArray[Math.floor(Math.random() * 16)]
            }
            selectedTile.push(newElem)
        }
        selectedTile.forEach((elem) => {
            console.log(`Disaster: Meteor on ${elem}`)
            let tileleft = parseInt(elem[0])*PLANESIZE/4    //x
            let tileright = tileleft + PLANESIZE/4          //x
            let tiletop = parseInt(elem[1])*PLANESIZE/4     //z
            let tilebtm = tiletop + PLANESIZE/4             //z
            for(let i=tiletop; i<tilebtm; i++){
                for(let j=tileleft; j<tileright; j++){
                    myWorld.creatures[i][j].forEach((creature)=>{
                        myWorld.predator = myWorld.predator.filter((element)=>element.object!==creature.object);
                        myWorld.prey = myWorld.prey.filter((element)=>element.object!==creature.object);
                        scene.remove(creature.object)
                    })
                    myWorld.creatures[i][j] = []    // remove all creatures from the position.
                    if(myWorld.foodDict[[i,j]] != null){
                        scene.remove(myWorld.foodDict[[i,j]].mesh)
                        myWorld.foodMap[i][j] = 0
                        myWorld.foodDict[[i,j]] = null;
                    }
                }
            }
            myWorld.envs[parseInt(elem[0]) + parseInt(elem[1])*4].isDamaged = 365    // damaged for 1month
            planeList[parseInt(elem[0])+parseInt(elem[1])*4].plane.material.map = meteorTexture
            recover = 365
        })
        myWorld.meteor = myWorld.turn+5
        animate()
    }
}
function iceAge(){
    // 3 달동안 전체 env의 온도가 하강함
    cancelAnimationFrame(animateId)
    myWorld.isIceAge = 3   // rise for 3 months
    snowInit()
    animate()
}
function globalWarming(){
    cancelAnimationFrame(animateId)
    myWorld.isWarming = 3   // rise for 3 months
    const sphereGeometry = new THREE.SphereGeometry( PLANESIZE*0.9, 32, 16, 0, Math.PI*2,  Math.PI/2, Math.PI )
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        side: THREE.DoubleSide,
        opacity: 0.1,
        transparent: true,
    })
    const redsphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    
    redsphere.position.z = 15
    redsphere.position.x = -30
    redsphere.rotation.x = Math.PI
    scene.add(redsphere)
    animate()
}

const particleNum = 10000;
const textureSize = 64.0;

const drawRadialGradation = (ctx, canvasRadius, canvasW, canvasH) => {
    ctx.save();
    const gradient = ctx.createRadialGradient(canvasRadius,canvasRadius,0,canvasRadius,canvasRadius,canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvasW,canvasH);
    ctx.restore();
}
const getTexture = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const diameter = textureSize;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;

    drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.type = THREE.FloatType;
    texture.needsUpdate = true;
    return texture;
}
function snowInit(){
    /* Snow Particles
   -------------------------------------------------------------*/
   const snowpoints = []
   for (let i = 0; i < particleNum; i++) {
       const x = Math.floor(Math.random() * 800 - 400);
       const y = Math.floor(Math.random() * 400 - 100);
       const z = Math.floor(Math.random() * 800 - 400);
       const particle = new THREE.Vector3(x, y, z);
       snowpoints.push(particle);
   }   
   let pointGeometry = new THREE.BufferGeometry().setFromPoints(snowpoints)
   
   const pointMaterial = new THREE.PointsMaterial({
       size: 8,
       color: 0xffffff,
       vertexColors: false,
       map: getTexture(),
       transparent: true,
       fog: true,
       depthWrite: false
   });

   const velocities = [];
   for (let i = 0; i < particleNum; i++) {
       const x = Math.floor(Math.random() * 6 - 10) * 0.1;
       const y = Math.floor(Math.random() * 6 + 3) * 0.1;
       const z = Math.floor(Math.random() * 6 - 3) * 0.1;
       const particle = new THREE.Vector3(x, y, z);
       velocities.push(particle);
   }

   particles = new THREE.Points(pointGeometry, pointMaterial);
   particles.geometry.velocities = velocities;
   particles.geometry.vertices = snowpoints;
   scene.add(particles);
}

function snowing(){
    const speed = 0.05
    particles.rotation.y += speed
}
// =======================================================


// ================ PlayPause =====================
let framecount = document.getElementById("framecount")
let pauseBtn = document.getElementById("pause")
let playBtn = document.getElementById("aniplay")
let frameNum = document.getElementById('frameNum')

pauseBtn.addEventListener('click', function(){
    cancelAnimationFrame(animateId)
})
playBtn.addEventListener('click', function(){
    cancelAnimationFrame(animateId)
    animate()
})
framecount.addEventListener('input', function(){
    cancelAnimationFrame(animateId)
    frameNum.innerHTML = framecount.value
    target_frame = parseInt(framecount.value)
    animate()
}, false)

// ================ Play KEY =====================



// 스페이스 바를 누르면 카메라 초기 상태로 돌려놓음
document.addEventListener("keydown",keyFuction,false);
function keyFuction(event){
    if(event.keyCode == 32){
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000)
        camera.position.set(0, 500, 3000)
        camera.lookAt(0,0,0)

        controls = new OrbitControls(camera, renderer.domElement)
        controls.addEventListener( 'change', render )
        controls.minPolarAngle = -Math.PI/2
        controls.maxPolarAngle =  Math.PI / 2 - 0.05;
        controls.minDistance=0
        controls.maxDistance= 9000

    }
}

// ----------------- for gragh----------------------
var curCreatureGragh    = document.getElementById('currentCreature')
var changeCreatureGragh = document.getElementById('changeCreature')
var curCharaterGragh    = document.getElementById('creatureCharacter')

var gragh1 = document.getElementById('cur-chart')
var gragh2 = document.getElementById('line-chart')
var gragh3 = document.getElementById('char-chart')

let chartContainer = document.querySelector('.chartContainer')
var s_gridmapC = document.getElementById('selectgridMap')
let s_gridmaps = document.querySelectorAll('.grid-')
console.log(s_gridmaps)
let s_gridmapList = Array.prototype.slice.call(s_gridmaps)

let graghCancelBtn = document.getElementById('gragh-cancel')

curCreatureGragh.addEventListener('click',function(){
    chartContainer.style.display = "block"
    gragh1.style.display = "block"
    graghType = 1
    makeCurGraph()
    console.log("1")
    
    gragh1_click = 1

    s_gridmapC.style.display = "none"
    gragh2.style.display = "none"
    gragh3.style.display = "none"
    gragh2_click = 0
    gragh3_click = 0 
})
changeCreatureGragh.addEventListener('click',function(){
    chartContainer.style.display = "block"
    gragh2.style.display = "block"
    graghType = 2
    makeAccGraph()
    gragh2_click = 1
    console.log("2")

    s_gridmapC.style.display = "none"
    gragh1.style.display = "none"
    gragh3.style.display = "none"
    gragh1_click = 0
    gragh3_click = 0
})
curCharaterGragh.addEventListener('click',function(){
    camera.position.set(0, 370, 340)
    camera.lookAt(0,0,0)
    gragh3.style.display="none"
    chartContainer.style.display = "block"
    s_gridmapC.style.display = "block"

    // grid를 
    s_gridmaps.forEach((grid,idx)=>{
        grid.style.backgroundImage = `url(${textureUrl[planeList[idx].type]})`
    })

    gragh3_click = 1
    gragh1.style.display = "none"
    gragh2.style.display = "none"
    gragh1_click = 0
    gragh2_click = 0  
})

// 그 grid를 클릭하면 그 grid의 차트 출력
s_gridmapList.forEach(grid => {
    grid.addEventListener('click', function(event){
        const xi = parseInt(event.target.id[0])
        const yi = parseInt(event.target.id[1])
        gragh3.style.display = "block"
        graghType = 3
        search_grid = yi*4+xi
        makeCharGragh(yi*4+xi)
        s_gridmapC.style.display = "none"
    })
})

graghCancelBtn.addEventListener('click',function(){
    chartContainer.style.display = "none"
    s_gridmapC.style.display = "none"
    gragh1.style.display = "none"
    gragh2.style.display = "none"
    gragh3.style.display = "none"
    gragh1_click = 0
    gragh2_click = 0
    gragh3_click = 0
})
// -------------------------------------------------

export default myWorld
