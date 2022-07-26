class env{
    constructor(){
        this.hot = 1
        this.cold = 1
        this.foodSpawn = 15
        this.isDamaged = 0
    }
}

export class Glacier extends env{
    constructor(){
        super()
        this.cold = 5
        this.foodSpawn = 5
    }
}

export class Desert extends env{
    constructor(){
        super()
        this.hot = 5
        this.foodSpawn = 5
    }
}

export class Grass extends env{
    constructor(){
        super()
    }
}

export class Jungle extends env{
    constructor(){
        super()
        this.hot = 3
        this.cold = 3
    }
}

export class Damaged extends env{
    // 벼락맞거나 운석떨어져서 그냥 불모지인 상황!
    constructor(){
        super()
        this.hot = 10
        this.cold = 10
        this.foodSpawn = 0
    }
}