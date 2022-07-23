import * as THREE from 'three'

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
        this.object = this.draw()   // 3D object of creature
        this.worldSize = worldSize // information of world
    }
    draw() {
        const sphereGeometry = new THREE.SphereGeometry(this.radius)    // size, div, division of geometry
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000FF,
            wireframe: false
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.set(this.position.x-this.worldSize/2, this.radius, this.position.z-this.worldSize/2)
        // console.log(`create sphere at ${this.position.x-15} ${this.position.z-15}`)
        
        this.scene.add(sphere)

        return sphere
    }
    // update(next_x, next_z) {
    //     this.position.x = next_x
    //     this.position.z = next_z
    //     this.object.position.x = next_x - this.worldSize/2
    //     this.object.position.z= next_z - this.worldSize/2
    // }
    destroy(){
        
        this.scene.remove(this.object)
    }
}