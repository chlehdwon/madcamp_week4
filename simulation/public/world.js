import * as THREE from 'three'
import Creature from './creature.js' 

export default class World{
    constructor(scene){
        this.creatures = []
        this.size ={
            width:250,
            height:250
        }
        this.foodMap = []       // number of food
        this.foodDict = {}
        this.turn = 1
        this.cid = 1
        this.food_num = 300      //
        this.energy = 200       // number of initial energy
        this.steps = 200        //
        this.mapInitializer()   //
        this.scene = scene
        this.foodRadius = 1
        this.stepping = true
    }

    mapInitializer(){
        for(var i=0; i<this.size.height; i++){
            var arr = []
            for(var j=0; j<this.size.width; j++){
                arr.push(0)
            }
            this.foodMap.push(arr)
        }
    }
    
    step(){
        this.stepping = false
        const xMoves = [1, -1, 0, 0, 1, -1, 1, -1]
        const zMoves = [0, 0, 1, -1, 1, -1, -1, 1]
        this.creatures.forEach((creature) => {
            const idx = Math.floor(Math.random() * xMoves.length);
            if(idx!==0 && !idx) console.log("?????")
            var next_x = creature.position.x + xMoves[idx]
            var next_z = creature.position.z + zMoves[idx]

            if(next_x >= this.size.width)
                next_x = this.size.width-1
            if(next_x <0)
                next_x = 0
            if(next_z >= this.size.height)
                next_z = this.size.height-1
            if(next_z < 0)
                next_z = 0
            
            // creature.update(next_x,next_z)
            creature.position.x = next_x
            creature.position.z = next_z
            creature.object.position.x = next_x - creature.worldSize/2
            creature.object.position.z= next_z - creature.worldSize/2
            // console.log(`${next_x} ${next_z}`)
            if(this.foodMap[next_z][next_x] > 0){
                // console.log(`creature ${creature.id} get food at ${next_x}, ${next_z}`)
                this.foodMap[next_z][next_x]-=1
                creature.food++
                // console.log(this.foodDict[[next_x, next_z]])
                this.scene.remove(this.foodDict[[next_x, next_z]])
            }

        })
        this.stepping = true
    }

    turnOver(){
        var babyCreature = []
        this.creatures.forEach((creature) => {
            if(creature.food==0){
                // console.log(`creature ${creature.id} died!`)
                this.creatures = this.creatures.filter((element)=>element.object!==creature.object);
                this.scene.remove(creature.object)
            }
            else if(creature.food>=2){
                // console.log(`creature ${creature.id} duplicated!`)
                var position = creature.position
                babyCreature.push(new Creature(this.cid, position.x, position.z, this.scene, this.size.width))
                // babyCreature.push(new Creature(this.cid, Math.floor(Math.random() * this.size.width), Math.floor(Math.random() * this.size.height), this.scene, this.size.width))
                this.cid+=1
                creature.food -= 2
            }
            else{
                // console.log(`creature ${creature.id} lived!`)
                creature.food -= 1
            }            
        })
        this.creatures.push(...babyCreature)
        console.log(`=====Turn ${this.turn} end=====`)
        console.log(`${this.creatures.length} creatures lived!`)
        this.turn+=1
        if(this.creatures.length>0)
            this.foodInit()
    }

    foodInit(){
        let i=0
        while(i<this.food_num){
            let x = Math.floor(Math.random() * this.size.width)
            let z = Math.floor(Math.random() * this.size.height)
            let width = this.size.width
            let height = this.size.height
            if(this.foodMap[z][x]>0) continue;
            const food_sphere = new THREE.Mesh(new THREE.SphereGeometry(this.foodRadius), new THREE.MeshBasicMaterial({color: 0xFF0000}))
            food_sphere.position.set(x-width/2, this.foodRadius, z-height/2)
            this.foodDict[[x,z]]=food_sphere
            // console.log(`create food at ${x} ${z}`)
            this.foodMap[z][x] += 1  // save food's position to my world!
            this.scene.add(food_sphere)
            i++;
        }
    }
}
