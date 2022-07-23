import * as THREE from 'three'
import { Loader } from 'three'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


const cowURL = `assets/cow.glb`// new URL(`assets/cow.glb`, import.meta.url)


// Animation object (= Creatures)
export default class Creature{
    constructor(id, x, z, scene, worldSize){
        this.position = {
            x, z
        }
        this.scene = scene
        this.food = 1                  
        this.id = id                // creation id of creature
        this.radius = 3             // radius of 3D-sphere
        this.object = null
        this.init(cowURL)
        this.worldSize = worldSize // information of world
    } 
    async init(url){
        const loader = new GLTFLoader();
        let gltfData = await loader.loadAsync(url)

        gltfData.scene.position.set(this.position.x-this.worldSize/2, this.radius, this.position.z-this.worldSize/2)
        gltfData.scene.scale.set(3,3,3)
        
        this.object = gltfData.scene
        this.scene.add(this.object)
    }
    // draw() {
    //     const sphereGeometry = new THREE.SphereGeometry(this.radius)    // size, div, division of geometry
    //     const sphereMaterial = new THREE.MeshBasicMaterial({
    //         color: 0x0000FF,
    //         wireframe: false
    //     })
    //     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    //     sphere.position.set(this.position.x-this.worldSize/2, this.radius, this.position.z-this.worldSize/2)
    //     // console.log(`create sphere at ${this.position.x-15} ${this.position.z-15}`)
        
    //     this.scene.add(sphere)

    //     return sphere
    // }
    // update(next_x, next_z) {
    //     this.position.x = next_x
    //     this.position.z = next_z
    //     this.object.position.x = next_x - this.worldSize/2
    //     this.object.position.z= next_z - this.worldSize/2
    // }

    update(next_x, next_z) {
        if(this.object){
            this.position.x = next_x
            this.position.z = next_z
            // this.object.position.set(next_x-15,0.3, next_z-15)
            this.object.position.x = next_x - this.worldSize/2
            this.object.position.z= next_z - this.worldSize/2
        }
    }
    destroy(){
        
        this.scene.remove(this.object)
    }
}