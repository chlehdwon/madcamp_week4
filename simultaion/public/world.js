import * as THREE from 'three'
import Creature from './creature.js' 

export default class World{
    constructor(scene){
        this.creatures = []
        this.size ={
            width:30,
            height:30
        }
        this.foodMap = []
        this.foodDict = {}
        this.turn = 1
        this.cid = 1
        this.food_num = 10
        this.energy = 200
        this.steps = 100
        this.mapInitializer()
        this.scene = scene
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
        const xMoves = [1, -1, 0, 0]
        const zMoves = [0, 0, 1, -1]
        this.creatures.forEach((creature) => {
            const idx = Math.floor(Math.random() * xMoves.length);
            var next_x = creature.position.x + xMoves[idx]
            var next_z = creature.position.z + zMoves[idx]

            if(next_x >= this.size.width){
                next_x = this.size.width-1
            } else if(next_x <0){
                next_x = 0
            } else if(next_z >= this.size.height){
                next_z = this.size.height-1
            } else if(next_z <0){
                next_z = 0
            }

            creature.update(next_x,next_z)

            if(this.foodMap[next_z][next_x] > 0){
                console.log(`creature ${creature.id} get food at ${next_x}, ${next_z}`)
                this.foodMap[next_z][next_x]-=1
                creature.food++
                // console.log(this.foodDict[[next_x, next_z]])
                this.scene.remove(this.foodDict[[next_x, next_z]])
            }
        })
    }

    turnOver(){
        var babyCreature = []
        this.creatures.forEach((creature) => {
            if(creature.food==0){
                console.log(`creature ${creature.id} died!`)
                this.creatures = this.creatures.filter((element)=>element.object!==creature.object);
                this.scene.remove(creature.object)
            }
            else if(creature.food>=2){
                console.log(`creature ${creature.id} duplicated!`)
                var position = creature.position
                // babyCreature.push(new Creature(this.cid, position.x, position.z))
                babyCreature.push(new Creature(this.cid, Math.floor(Math.random() * this.size.width), Math.floor(Math.random() * this.size.height), this.scene))
                this.cid+=1
                creature.food = 0
            }
            else{
                console.log(`creature ${creature.id} lived!`)
                creature.food = 0
            }            
        })
        this.creatures.push(...babyCreature)
        if(this.creatures.length>0)
            this.foodInit()
    }

    foodInit(){
        let i=0
        while(i<this.food_num){
            let x = Math.floor(Math.random() * this.size.width)
            let z = Math.floor(Math.random() * this.size.height)
            if(this.foodMap[z][x]>0) continue;
            const food_sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({color: 0xFF0000}))
            food_sphere.position.set(x-15, -0.5, z-15)
            this.foodDict[[x,z]]=food_sphere
            console.log(`create food at ${x} ${z}`)
            this.foodMap[z][x] += 1  // save food's position to my world!
            this.scene.add(food_sphere)
            i++;
        }
    }
}
