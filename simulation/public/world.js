import * as THREE from 'three'
import Creature from './creature.js' 
import {Jungle, Desert, Glacier, Grass} from './env.js'
import Food from './food.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'


const loader = new GLTFLoader();
let foodURL = 'assets/food.glb'

export default class World{
    constructor(scene, preyNum,predatorNum){
        // basic information
        this.size = 700
        this.turn = 1
        this.cid = 1    
        this.scene = scene

        // creature information
        this.prey = []
        this.predator = []
        this.creatures = Array(this.size).fill(null).map(()=>Array(this.size).fill(null).map(()=>Array(0)))  // creature map

        // food information
        this.foodMap = Array(this.size).fill(null).map(()=>Array(this.size).fill(null).map(()=>Array(0)))  // food map
        this.foodDict = {}
        this.foodRadius = 1

        // env information
        this.lightning = -365
        this.meteor = -365*3

        // Jungle, Desert, Glacier, Grass
        this.envs = [new Grass(), new Grass(), new Grass(), new Grass(),
                new Grass(), new Grass(), new Grass(), new Grass(),
                new Grass(), new Grass(), new Grass(), new Grass(),
                new Grass(), new Grass(), new Grass(), new Grass()]
        this.baseEnvs = JSON.parse(JSON.stringify(this.envs))
        this.isWarming = 0
        this.isIceAge = 0


        // turn information
        this.energy = 300       // number of initial energy
        // this.turn = 300        // number of energy amount

        // start initialization
        this.creatureInit(preyNum,predatorNum)
    }

    creatureInit(preyNum,predatorNum){
        for (var i =0;i<preyNum;i++){    // 1차 소비자
            this.prey.push(new Creature({
                id:this.cid++, 
                x: Math.floor(Math.random() * this.size), 
                z: Math.floor(Math.random() * this.size), 
                scene: this.scene, 
                worldSize: this.size,
                type: 1,
                speed: 3, 
                sight: 8,
                coldresist: 3,
                hotresist: 3,
                efficiency: 1,
                isfarsighted: true
            }))
        }
        for (var j =0;j<predatorNum;j++){    // 2차 소비자
            this.predator.push(new Creature({
                id: this.cid++, 
                x: Math.floor(Math.random() * this.size), 
                z: Math.floor(Math.random() * this.size), 
                scene: this.scene, 
                worldSize: this.size,
                type: 2,
                speed: 4,
                sight: 4, 
                coldresist: 2,
                hotresist: 2,
                efficiency: 1.5,
                isfarsighted: true
            }))
        }

        this.prey.forEach((creatures)=>{
            this.creatures[creatures.position.z][creatures.position.x].push(creatures)
        })
        this.predator.forEach((creatures)=>{
            this.creatures[creatures.position.z][creatures.position.x].push(creatures)
        })
        
    }

    getCurrentEnv(xpos, zpos){
        let x_idx = parseInt(xpos/(this.size/4)) 
        let z_idx = parseInt(zpos/(this.size/4)) 

        return this.envs[z_idx*4 + x_idx]
    }

    foodInit(){
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                // Get environment
                let env = this.envs[i*4 + j]
                let start_z = this.size/4*i
                let start_x = this.size/4*j
                let k=0

                // Food initialization
                while(k<env.foodSpawn){
                    let x = Math.floor(Math.random() * this.size/4) + start_x
                    let z = Math.floor(Math.random() * this.size/4) + start_z
                    if(this.foodMap[z][x]>0) continue;

                    let food_obj = new Food({x: x-this.size/2, y: this.foodRadius, z: z-this.size/2, radius: this.foodRadius, scene: this.scene})
                
                    // const food_sphere = new THREE.Mesh(new THREE.SphereGeometry(this.foodRadius), new THREE.MeshBasicMaterial({color: 0x00FF00}))
                    // food_sphere.position.set(x-this.size/2, this.foodRadius, z-this.size/2)
                    this.foodDict[[z,x]]=food_obj
                    this.foodMap[z][x] += 1  // save food's position to my world!
                    k++;
                }
            }
        }
    }

    day(isfarsighted){
        this.prey.forEach((creature) => {
            var direction = this.searchFood(creature)
            let coldDamage = 0
            let hotDamage = 0
            if(creature.changeDirect==0 || creature.isChasing){
                creature.direction = direction
                creature.changeDirect = creature.isChasing ? 1 : Math.floor(Math.random() * 5) + 10;
            }

            direction = creature.direction
            creature.changeDirect--;
            for(var i = 0;i<creature.speed;i++){
                this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
                let env = this.getCurrentEnv(creature.position.x, creature.position.z)
                coldDamage += env.cold-creature.coldresist > 0 ? env.cold-creature.coldresist : 0
                hotDamage += env.hot-creature.hotresist > 0 ? env.hot-creature.hotresist : 0

                var next_x = creature.position.x + direction[1]
                var next_z = creature.position.z + direction[0]

                if(next_x >= this.size){
                    next_x = this.size-1
                    creature.changeDirect = 0
                }
                if(next_x <0){
                    next_x = 0
                    creature.changeDirect = 0
                }
                if(next_z >= this.size){
                    next_z = this.size-1
                    creature.changeDirect = 0
                }
                if(next_z <0){
                    next_z = 0
                    creature.changeDirect = 0
                }
                
                creature.update(next_x, next_z, isfarsighted)

                // 이동한 후 생명체의 위치 저장
                this.creatures[creature.position.z][creature.position.x].push(creature)


                if(this.foodMap[next_z][next_x] > 0){
                    this.foodMap[next_z][next_x]-=1
                    this.scene.remove(this.foodDict[[next_z, next_x]].mesh)
                    let full = creature.hpScale*creature.efficiency*2
                    let plus = creature.hp>=full ? 0 : full/4
                    creature.hp += plus
                }
                if(creature.isChasing){
                    direction = this.searchFood(creature)
                    creature.direction = direction
                }
            }
            creature.hp -= (creature.speed + (hotDamage + coldDamage)*3)
            if(hotDamage>0) // console.log("so hot")
            if(coldDamage>0) // console.log("so cold")

            if(creature.hp<=0){
                this.prey = this.prey.filter((element)=>element.object!==creature.object);
                this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
                this.scene.remove(creature.object)
            }
        })
        this.predator.forEach((creature) => {
            var direction = this.searchPrey(creature)
            let coldDamage = 0
            let hotDamage = 0
            if(creature.changeDirect==0 || creature.isChasing){
                creature.direction = direction
                creature.changeDirect = creature.isChasing ? 1 : Math.floor(Math.random() * 5) + 10;
            }
            direction = creature.direction
            creature.changeDirect--;
            for(var i = 0;i<creature.speed;i++){
                this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
                console.log("predator: ",direction)
                if(direction===[0,0]) console.log("prdator no move!!!!!!!")
                let env = this.getCurrentEnv(creature.position.x, creature.position.z)
                
                coldDamage += env.cold-creature.coldresist > 0 ? env.cold-creature.coldresist : 0
                hotDamage += env.hot-creature.hotresist > 0 ? env.hot-creature.hotresist : 0

                var next_x = creature.position.x + direction[1]
                var next_z = creature.position.z + direction[0]

                if(next_x >= this.size){
                    next_x = this.size-1
                    creature.changeDirect = 0
                }
                if(next_x <0){
                    next_x = 0
                    creature.changeDirect = 0
                }
                if(next_z >= this.size){
                    next_z = this.size-1
                    creature.changeDirect = 0
                }
                if(next_z <0){
                    next_z = 0
                    creature.changeDirect = 0
                }
                creature.update(next_x,next_z, isfarsighted)
                // 이동한 후 생명체의 위치 저장
                this.creatures[creature.position.z][creature.position.x].push(creature)

                
                // 이동한 곳에 prey가 있고 포식자의 food가 2보다 작으면 prey 먹음
                for (var p of this.creatures[creature.position.z][creature.position.x]){
                    if(p.type==1 && creature.hp<=creature.hpScale*2){
                        this.scene.remove(p.object)
                        this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==p.object);
                        this.prey= this.prey.filter((element)=>element.object!==p.object);
                        // creature.food+=1
                        creature.hp = creature.efficiency * creature.hpScale
                    }
                }
                if(creature.isChasing){
                    direction = this.searchPrey(creature)
                    creature.direction = direction
                }
            }
            creature.hp -= (creature.speed + (hotDamage + coldDamage)*3)

            if(creature.hp<=0){
                this.predator = this.predator.filter((element)=>element.object!==creature.object);
                this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
                this.scene.remove(creature.object)
            }
        })
        // console.log(this.turn)
        this.turn += 1
    }

    yearOver(isfarsighted){
        var babyCreature = []
        this.prey.forEach((creature) => {
            // if(creature.hp<=0){
            //     this.prey = this.prey.filter((element)=>element.object!==creature.object);
            //     this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
            //     this.scene.remove(creature.object)
            // }
            if(creature.hp>=creature.hpScale*2){
                var position = creature.position
                var newCreatureInfo = this.mutationAlgo(creature)
                var newCreature =new Creature({
                    id:this.cid++, 
                    x: position.x, 
                    z: position.z, 
                    scene: this.scene, 
                    worldSize: this.size,
                    type: 1,
                    speed: newCreatureInfo.speed, 
                    sight: newCreatureInfo.sight,
                    coldresist: newCreatureInfo.coldresist,
                    hotresist:  newCreatureInfo.hotresist,
                    efficiency: newCreatureInfo.efficiency,
                    isfarsighted: isfarsighted
                })
                babyCreature.push(newCreature)
                this.creatures[position.z][position.x].push(newCreature)
                
                // this.cid+=1
                // creature.food -= 2
                creature.hp -= creature.hpScale * 2
            }
            // else{
            //     creature.food -= 1
            // }            
        })
        this.prey.push(...babyCreature)

        babyCreature = []
        this.predator.forEach((creature) => {
            // if(creature.food<=0){
            //     this.predator = this.predator.filter((element)=>element.object!==creature.object);
            //     this.creatures[creature.position.z][creature.position.x]=this.creatures[creature.position.z][creature.position.x].filter((element)=>element.object!==creature.object);
            //     this.scene.remove(creature.object)
            // }
            if(creature.hp>=creature.hpScale*2){
                var position = creature.position
                var newCreatureInfo = this.mutationAlgo(creature)

                var newCreature =new Creature({
                    id:this.cid++, 
                    x: position.x, 
                    z: position.z, 
                    scene: this.scene, 
                    worldSize: this.size,
                    type: 2,
                    speed: newCreatureInfo.speed, 
                    sight: newCreatureInfo.sight,
                    coldresist: newCreatureInfo.coldresist,
                    hotresist:  newCreatureInfo.hotresist,
                    efficiency: newCreatureInfo.efficiency,
                    isfarsighted: isfarsighted
                })
                babyCreature.push(newCreature)
                this.creatures[position.z][position.x].push(newCreature)
                
                creature.hp -= creature.hpScale * 2
            }
            // else{
            //     creature.food -= 1
            // }            
        })
        this.predator.push(...babyCreature)

        // Disaster: env change
        this.envs.forEach((item, idx)=>{
            if (item.isDamaged > 0){
                // 불모지
                item.foodSpawn = 0
                if(item.isDamaged == 1){
                    item.cold = this.baseEnvs[idx].cold
                    item.hot = this.baseEnvs[idx].hot
                    item.foodSpawn = this.baseEnvs[idx].foodSpawn
                }
                item.isDamaged -= 1
            }else{
                item = item.originalEnv
            }
        })
        if(this.isWarming > 0){
            this.envs.forEach((item)=>{
                // 지구온난화
                item.hot += 1
                item.cold -= 1
            })
            if(this.isWarming == 1){
                this.baseEnvs = JSON.parse(JSON.stringify(this.envs)) // 영원하게 변형
            }
            
            console.log(`globalwarming Countdown: ${this.isWarming}`)
            console.log(this.envs[0])
            console.log(this.baseEnvs)

            this.isWarming -= 1
        }
        
        if(this.isIceAge > 0){
            this.envs.forEach((item, idx)=>{
                // 빙하기
                item.hot =  this.baseEnvs[idx].hot - 5
                item.cold = this.baseEnvs[idx].cold + 5
                item.foodSpawn = parseInt(this.baseEnvs[idx].foodSpawn/2)
            })
            if(this.isIceAge == 1){ // 원상복귀
                this.envs.forEach((item, idx)=>{
                    item.cold = this.baseEnvs[idx].cold
                    item.hot = this.baseEnvs[idx].hot
                    item.foodSpawn = this.baseEnvs[idx].foodSpawn
                })
            }

            console.log(`IceAge Countdown: ${this.isIceAge}`)
            console.log(this.envs[0])
            console.log(this.baseEnvs)

            this.isIceAge -= 1
        }
        if(this.prey.length>0)
            this.foodInit()
        
    }
    
    mutationAlgo(each_creature){
        let newCreatureInfo = Object.assign({},each_creature)
        let mutationPercent = 90
        let attributeArray = [each_creature.speed, each_creature.sight/2 - 1 , each_creature.coldresist, each_creature.hotresist, each_creature.efficiency]

        // 변이가 일어난다면 한 특정한 속성 하나는 올리고 한개는 내림

        if(Math.floor(Math.random() * 100) < mutationPercent){
            console.log("돌연변이 발생")
            let upperAttribute = Math.floor(Math.random() * 5)
            let downAttribute  = Math.floor(Math.random() * 5)

            // 각 index의 값들이 범위를 벗어나면 다시 찾음
            while(attributeArray[upperAttribute]>=4){
                upperAttribute = Math.floor(Math.random() * 5)
            }
            while(attributeArray[downAttribute]<=0){
                downAttribute = Math.floor(Math.random() * 5)
            }
            
            // 각 index의 값들을 한 개는 올리고 한개는 올림
            attributeArray[upperAttribute] += 1
            attributeArray[downAttribute]  -= 1
        }
        attributeArray[1] = attributeArray[1]*2 + 2 

        newCreatureInfo.speed      = attributeArray[0]
        newCreatureInfo.sight      = attributeArray[1]
        newCreatureInfo.coldresist = attributeArray[2]
        newCreatureInfo.hotresist  = attributeArray[3]
        newCreatureInfo.efficiency = attributeArray[4]
        
        return newCreatureInfo
    }

    // opposite_type은 반대 type 
    searchAlgo(each_creature,xpos,zpos,scope,opposite_type){
        var direction = [0,0] //z,x
        var returnlist = []
        var minDistance = 100
        
        for(var i=this.minScope(xpos,scope);i<this.maxScope(xpos,scope);i++){
            for(var j=this.minScope(zpos,scope);j<this.maxScope(zpos,scope);j++){
                for(var c of this.creatures[j][i]){
                    if(c.type ==opposite_type){
                        var d = this.distance([zpos,xpos],[j,i])

                        // 기존과 같은 거리의 prey가 있다면 returnlist에 push
                        if(d==minDistance){
                            returnlist.push([j - zpos,i- xpos])
                        }
                        // 만약 거리가 작은게 있다면 returnlist 초기화 하고 push
                        else if(d < minDistance){
                            minDistance=d
                            returnlist=[]
                            returnlist.push([j- zpos,i- xpos])
                        }
                    }
                }
            }
        }
        
        // 만약 scope안에 prey가 없다면 랜덤으로 움직임
        if(minDistance==100 || each_creature.hp > each_creature.hpScale*2*each_creature.efficiency){
            each_creature.isChasing = false;
            
            // prey가 찾는거면 빈칸 return
            if(opposite_type == 2){return([])}

            // predator가 찾는거면 랜덤 return
            direction= this.makeRandomDirec()
        }

        // predator : 거리가 같은 prey 중에서 랜덤으로 하나를 선택하여 그 방향으로 감
        // prey     : 거리가 같은 predator 중에서 랜덤으로 하나를 선택하여 그 반대 방향으로 감
        else{
            const idx = Math.floor(Math.random() * returnlist.length);
            direction[0] = returnlist[idx][0] === 0 ? 0 : returnlist[idx][0] / Math.abs(returnlist[idx][0])
            direction[1] = returnlist[idx][1] === 0 ? 0 : returnlist[idx][1] / Math.abs(returnlist[idx][1])
            each_creature.isChasing = true;
            if(opposite_type == 2){
                direction[0]*=-1
                direction[1]*=-1
            }
        }
        return direction
    }

    searchFood(each_creature){
        var scope = each_creature.sight
        var direction = [0,0] //z,x

        var xpos = each_creature.position.x
        var zpos = each_creature.position.z

        // 현재 위치에 포식자가 있는데 아직 내가 안죽었다면 임의의 방향으로 도망침
        for (var c of this.creatures[zpos][xpos]){
            if(c.type == 2){
                // console.log("in rand")
                return this.makeRandomDirec()
            }
                
        }
        
        // 포식자를 주위에서 찾았다면 반대 방향으로 도망침
        direction = this.searchAlgo(each_creature,xpos,zpos,scope,2)
        if(direction.length !=0){
            return direction
        }

        direction = [0,0]
        // 현재 위치에 먹이가 있다면 안 움직임
        if(this.foodMap[zpos][xpos]>0){
            // console.log("prey no move")
            return direction
        }
        
        // 먹이를 찾았다면 그 방향으로 움직임
        var nearlist = []
        var minDistance = 100
        for(var i=this.minScope(xpos,scope); i<this.maxScope(xpos,scope);i++){
            for(var j=this.minScope(zpos,scope); j<this.maxScope(zpos,scope);j++){
                if(this.foodMap[j][i]>0){
                    var d = this.distance([zpos,xpos],[j,i])
                    if(d == minDistance){
                        nearlist.push([j- zpos,i-xpos])
                    }
                    else if(d < minDistance){
                        minDistance = d
                        nearlist=[]
                        nearlist.push([j- zpos,i-xpos])
                    }
                }
            }
        }
        // 주위에 먹이가 없다면 랜덤하게 움직임
        if(minDistance==100 || each_creature.hp > each_creature.hpScale*2*each_creature.efficiency){
            direction = this.makeRandomDirec()
            each_creature.isChasing = false
            
        }
        // 주위에 먹이가 있으면 가장 가까운 것을 저장한 nearlist 배열에서 랜덤하게 얻어서 그 방향으로 감
        else{
            each_creature.isChasing = true;
            const idx = Math.floor(Math.random() * nearlist.length);
            direction[0] = nearlist[idx][0] === 0 ? 0 : nearlist[idx][0] / Math.abs(nearlist[idx][0])
            direction[1] = nearlist[idx][1] === 0 ? 0 : nearlist[idx][1] / Math.abs(nearlist[idx][1])
        }
        return direction
    }
    
    searchPrey(each_creature){
        var scope = each_creature.sight
        var direction = [0,0] //z,x
        var xpos = each_creature.position.x
        var zpos = each_creature.position.z

        // 현재 위치에 먹이가 있다면 안 움직임
        // if(this.food >2){
        if(this.hp > this.hpScale * 2){
            return this.makeRandomDirec()
        }else if(this.creatures[zpos][xpos].type==1){
            // console.log("predactor no move")
            return direction
        }
        return this.searchAlgo(each_creature,xpos,zpos,scope,1)
    }

    makeRandomDirec(){
        var direction = [0,0]
        // 주위에 먹이가 없다면 랜덤하게 움직임
        const xMoves = [1, -1, 0, 0, 1, -1, 1, -1]
        const zMoves = [0, 0, 1, -1, 1, 1, -1, -1]
        const idx = Math.floor(Math.random() * xMoves.length);
        direction[0]=zMoves[idx]
        direction[1]=xMoves[idx]
        return direction
    }

    distance(n1,n2){return Math.sqrt((n1[0] - n2[0]) ** 2 + (n1[1] - n2[1]) ** 2)}
    minScope(pos,scope){return pos-scope>0 ? pos-scope : 0}
    maxScope(pos,scope){return pos+scope < this.size ? pos+scope : this.size - 1}
}
