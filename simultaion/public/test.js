import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
 


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const scene = new THREE.Scene()
 
const camera = new THREE.PerspectiveCamera(
  -45,
  window.innerWidth / window.innerHeight,
  0.1,
  100)
camera.position.set(-10, 30, 30)
 
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
 

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1)    // size, div, division of geometry
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000FF,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(10, -1, 0)
scene.add(sphere)


function animate() {
    requestAnimationFrame(animate)
    box.rotation.x += 0.01
    box.rotation.y += 0.01
    render()
}
 
function render() {
    renderer.render(scene, camera)
}
animate()

render()


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