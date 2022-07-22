import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import World from './world.js' 
import Creature from './creature.js' 


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



const scene = new THREE.Scene()
 
const camera = new THREE.PerspectiveCamera(
  -45,
  window.innerWidth / window.innerHeight,
  0.1,
  100)
camera.position.set(-10, -30, 30)
 
const controls = new OrbitControls(camera, renderer.domElement)
 
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true,})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5*Math.PI

const gridHelper = new THREE.GridHelper(30) //size of grid, division of grid
scene.add(gridHelper)
 




// // Animation object (= Creatures)
// class Creature{
//     constructor(id, x, z){
//         this.position = {
//             x, z
//         }
//         this.food = 0
//         this.id = id
//         this.radius = 0.3
//         this.object = this.draw()
//     }
//     draw() {
//         /* TODO: draw blue sphere with this.radius. 참고: draw sphere
//         const sphereGeometry = new THREE.SphereGeometry(1)    // size, div, division of geometry
//         const sphereMaterial = new THREE.MeshBasicMaterial({
//             color: 0x0000FF,
//             wireframe: false
//         })
//         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//         sphere.position.set(10, -1, 0)
//         scene.add(sphere)
//         */
//         const sphereGeometry = new THREE.SphereGeometry(this.radius)    // size, div, division of geometry
//         const sphereMaterial = new THREE.MeshBasicMaterial({
//             color: 0x0000FF,
//             wireframe: false
//         })
//         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//         sphere.position.set(this.position.x-15, -0.3, this.position.z-15)
//         console.log(`create sphere at ${this.position.x-15} ${this.position.z-15}`)
//         scene.add(sphere)

//         return sphere
//     }
//     update(next_x, next_z) {
//         this.position.x = next_x
//         this.position.z = next_z
//         this.object.position.x = next_x - 15
//         this.object.position.z= next_z - 15
//     }
//     destroy(){
//         scene.remove(this.object)
//     }
// }

// class World{
//     constructor(){
//         this.creatures = []
//         this.size ={
//             width:30,
//             height:30
//         }
//         this.foodMap = []
//         this.foodDict = {}
//         this.turn = 1
//         this.cid = 1
//         this.food_num = 10
//         this.energy = 100
//         this.arrayInitializer()
//     }

//     arrayInitializer(){
//         for(var i=0; i<this.size.height; i++){
//             var arr = []
//             for(var j=0; j<this.size.width; j++){
//                 arr.push(0)
//             }
//             this.foodMap.push(arr)
//         }
//     }
    
//     step(){
//         this.creatures.forEach((creature) => {
//             const idx = Math.floor(Math.random() * xMoves.length);
//             var next_x = creature.position.x + xMoves[idx]
//             var next_z = creature.position.z + zMoves[idx]

//             if(next_x >= myWorld.size.width){
//                 next_x = myWorld.size.width-1
//             } else if(next_x <0){
//                 next_x = 0
//             } else if(next_z >= myWorld.size.height){
//                 next_z = myWorld.size.height-1
//             } else if(next_z <0){
//                 next_z = 0
//             }

//             creature.update(next_x,next_z)

//             if(this.foodMap[next_z][next_x] > 0){
//                 console.log(`creature ${creature.id} get food at ${next_x}, ${next_z}`)
//                 this.foodMap[next_z][next_x]-=1
//                 creature.food++
//                 console.log(this.foodDict[[next_x, next_z]])
//                 scene.remove(this.foodDict[[next_x, next_z]])
//             }
//         })
//     }

//     turnOver(){
//         var babyCreature = []
//         this.creatures.forEach((creature) => {
//             if(creature.food==0){
//                 console.log(`creature ${creature.id} died!`)
//                 this.creatures = this.creatures.filter((element)=>element.object!==creature.object);
//                 scene.remove(creature.object)
//             }
//             else if(creature.food>=2){
//                 console.log(`creature ${creature.id} duplicated!`)
//                 var position = creature.position
//                 // babyCreature.push(new Creature(this.cid, position.x, position.z))
//                 babyCreature.push(new Creature(this.cid, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene))



                
//                 this.cid+=1
//                 creature.food = 0
//             }
//             else{
//                 console.log(`creature ${creature.id} lived!`)
//                 creature.food = 0
//             }            
//         })
//         this.creatures.push(...babyCreature)
//         if(this.creatures.length>0)
//             this.foodInit()
//     }

//     foodInit(){
//         let i=0
//         while(i<this.food_num){
//             let x = Math.floor(Math.random() * myWorld.size.width)
//             let z = Math.floor(Math.random() * myWorld.size.height)
//             if(myWorld.foodMap[z][x]>0) continue;
//             const food_sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({color: 0xFF0000}))
//             food_sphere.position.set(x-15, -0.5, z-15)
//             this.foodDict[[x,z]]=food_sphere
//             console.log(`create food at ${x} ${z}`)
//             myWorld.foodMap[z][x] += 1  // save food's position to my world!
//             scene.add(food_sphere)
//             i++;
//         }
//     }
// }

// Here main satarts!!
// Only one turn.....
const myWorld = new World(scene)

console.log("=====world creation done=====")

//create adam and eve
let creatures = []
myWorld.creatures.push(new Creature(1, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene))
myWorld.creatures.push(new Creature(2, Math.floor(Math.random() * myWorld.size.width), Math.floor(Math.random() * myWorld.size.height), scene))
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