import * as THREE from 'three'

// Animation object (= Creatures)
export default class Creature{
    constructor(id, x, z, scene){
        this.position = {
            x, z
        }
        this.scene = scene
        this.food = 1
        this.id = id
        this.radius = 0.3
        this.object = this.draw()
    }
    draw() {
        const sphereGeometry = new THREE.SphereGeometry(this.radius)    // size, div, division of geometry
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000FF,
            wireframe: false
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.set(this.position.x-15, -0.3, this.position.z-15)
        // console.log(`create sphere at ${this.position.x-15} ${this.position.z-15}`)
        
        this.scene.add(sphere)

        return sphere
    }
    update(next_x, next_z) {
        this.position.x = next_x
        this.position.z = next_z
        this.object.position.x = next_x - 15
        this.object.position.z= next_z - 15
    }
    destroy(){
        
        this.scene.remove(this.object)
    }
}