from creature import Creature
from world import World
import random



food_num = 10
energy = 50
move = [(1,0), (-1,0), (0,1), (0,-1)]


def main():
    # create first creature
    myworld = World()
    myworld.creatures.append(Creature(1, int(random.random()*myworld.X), int(random.random()*myworld.Y)))
    myworld.creatures.append(Creature(2, int(random.random()*myworld.X), int(random.random()*myworld.Y)))
    myworld.id=3
    for _ in range(1000):
        turn(myworld)
     
def turn(myworld):
    print(f'==========trun: {myworld.turn}==========')
    # set food's position
    food_pos = []
    print("-----init phase-----")
    for _ in range(food_num):
        x = int(random.random()*myworld.X)
        y = int(random.random()*myworld.Y)
        food_pos.append((x,y))
        myworld.food_map[y][x] += 1
    
    print(food_pos,"\n")
    
    # print init creatures status
    print("-----move phase-----")
    for c in myworld.creatures:
        print(f'creature id {c.id}: ({c.x}, {c.y})')
    
    max_X  = myworld.X
    max_Y = myworld.Y 
    # creatures move
    for _ in range(energy):
        for c in myworld.creatures:
            move_x, move_y = random.choice(move)
            c.x += move_x
            c.y += move_y
            if c.x>=max_X:
                c.x=max_X-1
            elif c.x<0:
                c.x=0
            if c.y>=max_Y:
                c.y=max_Y-1
            elif c.y<0:
                c.y=0
            
            if(myworld.food_map[c.y][c.x]>0):
                print(f'creature {c.id} get food at {c.id}: ({c.x}, {c.y})')
                myworld.food_map[c.y][c.x]-=1
                c.food += 1

    print("\n-----final phase-----")
    baby_creatures = []
    for c in myworld.creatures:
        if c.food==0:
            print(f'creature {c.id} died')
            myworld.creatures.remove(c)
        elif c.food>=2:
            print(f'creature {c.id} duplicated!')
            baby_creatures.append(Creature(myworld.id, int(random.random()*myworld.X), int(random.random()*myworld.Y)))
            myworld.id+=1
            c.food=0
        else:
            print(f'creature {c.id} lived!')
            c.food=0
    myworld.creatures += baby_creatures
    print("\n=====turn end=====")
    print(f'{len(myworld.creatures)} creature survived')
                       
    
main()