class World:
    def __init__(self):
        self.creatures = []
        self.X = 100
        self.Y = 100
        self.food_map = [[0]*self.X]*self.Y
        self.turn = 1
        self.id = 1
    