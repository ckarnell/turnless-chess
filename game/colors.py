class Color(object):
    def __eq__(self, other):
        return self.__class__ == other.__class__

WHITE = 'W'
BLACK = 'B'

class White(Color):
    char = WHITE
    direction = 1

class Black(Color):
    char = BLACK
    direction = -1
