import * as THREE from 'three'
import { Loader } from 'three'
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


const urlList = [`assets/nullbird.glb`, `assets/prey/prey_34.glb`, `assets/predetor/predetor_plain.glb`] // new URL(`assets/cow.glb`, import.meta.url)
const colorList = [0x000000,0x0000FF, 0xFF0000]
const typelist = ['food','prey','predetor']


// Animation object (= Creatures)
export default class Creature{
    constructor({id, x, z, scene, worldSize, type, speed, sight, coldresist, hotresist, efficiency, isfarsighted}){     
        // basic parameter
        this.id = id   
        this.food = 1                // creation id of creature
        this.worldSize = worldSize // information of world
        this.hpScale = 365*speed      // food per efficiency (1 eat => 30*speed*efficiency energy)
        this.hp = (efficiency) * this.hpScale


        // creature parameter
        this.type = type
        this.speed = speed
        this.sight = sight
        this.coldresist = coldresist
        this.hotresist = hotresist
        this.efficiency = efficiency

        // moving parameter
        this.position = {x, z}       
        this.changeDirect = 0      // change direction when this value is 0
        this.direction = [0,0]     // store creature's direction
        this.isChasing = false

        // rendering parameter
        this.scene = scene   
        this.isfarsighted = isfarsighted
        this.objectUrl = `assets/${typelist[this.type]}/${typelist[this.type]}_${coldresist}${hotresist}.glb`
        this.radius = 1          // radius of 3D-sphere
        this.object = null
        this.closeView = null
        this.farView = this.draw()
        this.clock = new THREE.Clock()
        this.animateMixer = null

        this.init()
    } 
    async init(){
        const loader = new GLTFLoader();
        let gltfData = await loader.loadAsync(this.objectUrl)

        gltfData.scene.position.set(this.position.x-this.worldSize/2, this.radius * this.type * 1.5, this.position.z-this.worldSize/2)
        gltfData.scene.scale.set(this.radius,this.radius,this.radius)
        gltfData.scene.rotation.y = Math.PI
        gltfData.scene.castShadow = true
        gltfData.scene.recieveShadow = true
        // ================ DONOT ERASE!! for ANIMATION ===================
        // this.animateMixer = new THREE.AnimationMixer(gltfData.scene)
        // const clips = gltfData.animations
        // const clip = THREE.AnimationClip.findByName(clips, "ArmatureAction")
        // const action = this.animateMixer.clipAction(clip);
        // action.play()
        
        this.closeView = gltfData.scene
        this.object = this.farView
        if(this.isfarsighted == false){
            this.object = this.closeView
        }
        this.scene.add(this.object)
    }
    draw() {
        const sphereGeometry = new THREE.SphereGeometry(this.radius)    // size, div, division of geometry
    
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: colorList[this.type],
            wireframe: false
        })
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.set(this.position.x-this.worldSize/2, this.radius, this.position.z-this.worldSize/2)
        sphere.castShadow = true
        sphere.receiveShadow = true
        return sphere
    }

    update(next_x, next_z, isfarsighted) {
        if(isfarsighted == true && this.isfarsighted == false){  
            this.isfarsighted = true    // change to farsighted
            this.scene.remove(this.object)

            this.farView.position.x = this.object.position.x
            this.farView.position.z = this.object.position.z
            this.object = this.farView
            this.scene.add(this.object)

        }else if(isfarsighted == false && this.isfarsighted == true){   
            this.isfarsighted = false   // change to closesighted
            this.scene.remove(this.object)

            this.closeView.position.x = this.object.position.x
            this.closeView.position.z = this.object.position.z
            this.object = this.closeView
            this.scene.add(this.object)
        }
        
        if(this.object){
            this.position.x = next_x
            this.position.z = next_z
    
            // this.animateMixer.update(this.clock.getDelta())
            let x = next_x - this.worldSize/2
            let z = next_z - this.worldSize/2
            var atan = Math.atan((x - this.object.position.x)/(z - this.object.position.z))
            this.object.rotation.y = isNaN(atan) ? 0 : atan + ((z - this.object.position.z)>=0 ? Math.PI : 0)
            this.object.position.x = x
            this.object.position.z= z
        }
    }
}