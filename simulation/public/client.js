import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
import World from './world.js' 
import Creature from './creature.js' 


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const scene = new THREE.Scene()
 
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1500)
camera.position.set(0, 300, 250)
camera.lookAt(0,0,0)
 
const controls = new OrbitControls(camera, renderer.domElement)
 

const planeGeometry = new THREE.PlaneGeometry(300,300)
const planeMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5*Math.PI

const loader = new GLTFLoader();
const iceURL = new URL('./assets/iceground.glb', import.meta.url)
let backgorund
loader.load(iceURL.href, function(gltf){
    backgorund = gltf.scene
    backgorund.rotation
    backgorund.scale.set(50, 10, 50)
    backgorund.position.y = 1
    scene.add(backgorund)
})

const light = new THREE.PointLight(0xffffff, 2, 1500)
light.position.set(0, 300, 250)
scene.add(light)


// const gridHelper = new THREE.GridHelper(500) //size of grid, division of grid
// scene.add(gridHelper)

// Here main satarts!!
// Only one turn.....
const myWorld = new World(scene)

console.log("=====world creation done=====")
console.log(`${myWorld.foodMap[0][0]}`)
//create adam and eve
let creatures = []
myWorld.creatures.push(new Creature(1, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width))
myWorld.creatures.push(new Creature(2, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene, myWorld.size.width))
myWorld.cid=3    // 생성된 크리쳐 개수

console.log("=====creature creation done=====")

// create food
myWorld.foodInit()

// console.log(myWorld.foodDict)
// console.log(myWorld.foodMap)
// console.log(myWorld.foodMap[0][0])

console.log("=====food creation done=====")

function animate() {
    requestAnimationFrame(animate)
    // console.log(camera.position)
    // creatures move
    if(myWorld.energy>0){
        myWorld.energy-=1
        myWorld.step()
    }
    else{
        myWorld.turnOver()
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