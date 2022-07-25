import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
import { Loader } from 'three'
import World from './world.js' 
import Creature from './creature.js' 


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
const myWorld = new World(scene)
console.log("=====world creation done=====")

//create adam and eve
let isfarsighted = true
for (var i =0;i<30;i++){    // 1차 소비자
    myWorld.prey.push(new Creature(myWorld.cid++, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width,1,1, isfarsighted))
}
for (var j =0;j<10;j++){    // 2차 소비자
    myWorld.predator.push(new Creature(myWorld.cid++, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width,3,2, isfarsighted))
}

// myWorld.creatures.push(new Creature(1, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width, true))
// myWorld.creatures.push(new Creature(2, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width, true))
// myWorld.cid=3    // 생성된 크리쳐 개수

myWorld.prey.forEach((creatures)=>{
    myWorld.creatures[creatures.position.z][creatures.position.x].push(creatures)
})
myWorld.predator.forEach((creatures)=>{
    myWorld.creatures[creatures.position.z][creatures.position.x].push(creatures)
})
console.log("=====creature creation done=====")

// create food
myWorld.foodInit()
console.log("=====food creation done=====")


function animate() {
    requestAnimationFrame(animate)

    // set farsighted & closesighted
    const dist = Math.sqrt((camera.position.x*camera.position.x) + (camera.position.y*camera.position.y) + (camera.position.z*camera.position.z))
    if(dist > 400)
        isfarsighted = true
    else
        isfarsighted = false

    // creatures move
    if(myWorld.energy>0){
        myWorld.energy-=1
        myWorld.step(isfarsighted)
    }
    else{
        myWorld.turnOver(isfarsighted)
        myWorld.energy=myWorld.steps
    }
    render() 
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

