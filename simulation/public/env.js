class env{
    constructor(){
        this.hot = 0
        this.cold = 0
        this.foodSpawn = 5
    }
}

export class Glacier extends env{
    constructor(){
        super()
        this.cold = 2
        this.foodSpawn = 0
    }
}

export class Desert extends env{
    constructor(){
        super()
        this.hot = 2
        this.foodSpawn = 0
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
        this.hot = 1
    }
}
