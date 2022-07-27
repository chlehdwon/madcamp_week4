import * as THREE from 'three'
import { Loader } from 'three'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


let foodURL = 'assets/food.glb'

// Animation object (= Creatures)
export default class Food{
    constructor({x, y, z, radius, scene}){     
        // basic parameter
        this.x = x
        this.y = y
        this.z = z
        this.radius = radius*5
        this.mesh = null
        this.scene = scene
        this.init()

    } 
    async init(){
        const loader = new GLTFLoader();
        let gltfData = await loader.loadAsync(foodURL)

        gltfData.scene.position.set(this.x, 0, this.z)
        gltfData.scene.scale.set(this.radius,this.radius,this.radius)
        gltfData.scene.castShadow = true
        gltfData.scene.recieveShadow = true
        this.mesh = gltfData.scene
        this.scene.add(gltfData.scene)
    }
}