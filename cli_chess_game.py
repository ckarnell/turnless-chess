from game.pieces import King, IllegalMoveException
from game.colors import Black, White
from game.chess_game import Chess, NoPieceException, NoLocationException, \
    LocationOccupiedException, NotYourPieceException

class CLI_Chess_Game(Chess):
    def __init__(self, *args, **kwargs):
        super(CLI_Chess_Game, self).__init__(*args, **kwargs)
        self.message = ''
        self.string_board_rep = self.get_string_board_rep()

    def print_board(self):
        print(chr(27) + "[2J") # Clear the screen
        print(self.message + '\n')
        print(self.string_board_rep)

    def play(self):
        while King(Black).symbol in self.string_board_rep and King(White).symbol in self.string_board_rep:
            self.print_board()
            move = input('Enter a move (e.g. "a2 a4")\n')
            if move.lower() in ['q', 'quit']:
                break
            start, end = move.split()
            try:
                game.move(start, end, self.white_player)
                self.string_board_rep = self.get_string_board_rep()
                self.message = ''
            except LocationOccupiedException:
                self.message = 'Location occupied! Try again!'
            except NoPieceException:
                self.message = 'There\'s no piece there! Try again!'
            except NoLocationException:
                self.message = 'That\'s not a space on the board! Try again!'
            except IllegalMoveException:
                self.message = 'That\'s not a legal move for that piece! Try again!'
            except NotYourPieceException:
                self.message = 'That\'s not your piece! Try again!'
        if King(Black).symbol not in self.string_board_rep:
            self.message = 'White wins!'
        elif King(White).symbol not in self.string_board_rep:
            self.message = 'Black wins!'
        self.print_board()

if __name__ == '__main__':
    game = CLI_Chess_Game()
    game.play()
