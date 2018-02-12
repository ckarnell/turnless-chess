from .pieces import Pawn, Rook, Knight, Bishop, Queen, King, IllegalMoveException
from .colors import Black, White

LETTERS = 'abcdefgh'
NUMBERS = '87654321'
PIECES = 'rnbqkbnr'
PIECE_MAP = {'r': Rook, 'n': Knight, 'b': Bishop, 'q': Queen, 'k': King}
LOCATIONS = [f'{letter}{number}' for number in NUMBERS for letter in LETTERS]

class NoPieceException(Exception):
    pass
class NoLocationException(Exception):
    pass
class LocationOccupiedException(Exception):
    pass
class NotYourPieceException(Exception):
    pass


class Player(object):
    def __init__(self, color, player_id=None):
        self.color = color
        self.player_id = player_id

class Board(object):
    def __init__(self):
        self.white_king_dirty = False
        self.black_king_dirty = False
        self.board_rep = self.build_initial_board()

    @staticmethod
    def build_initial_board():
        black_first_row = dict(zip(LOCATIONS[:8], [PIECE_MAP[piece](Black()) for piece in PIECES]))
        black_pawn_row = {location: Pawn(Black()) for location in LOCATIONS[8:16]}
        middle_rows = {location: None for location in LOCATIONS[16:-16]}
        white_pawn_row = {location: Pawn(White()) for location in LOCATIONS[-16:-8]}
        white_first_row = dict(zip(LOCATIONS[-8:], [PIECE_MAP[piece](White()) for piece in PIECES]))
        return {
            **black_first_row,
            **black_pawn_row,
            **middle_rows,
            **white_pawn_row,
            **white_first_row,
        }

    def get_string_board_rep(self):
        row = ''
        letter_row = f'  {"  ".join(list(LETTERS))}\n'
        result = letter_row
        for ind, location in enumerate(LOCATIONS):
            piece = self.board_rep[location]
            if piece is not None:
                string_rep = f'{piece.symbol} '
            else:
                string_rep = '  '
            row = f'{row}|{string_rep}'
            new_row = not (ind+1) % 8
            if new_row:
                number = NUMBERS[int(ind/8)]
                result = f'{result}{number}{row}|{number}\n'
                row = ''
        return result + letter_row

    @staticmethod
    def location_exists(location):
        return location in LOCATIONS


class Chess(Board):
    def __init__(self, player_one=None, player_two=None, *args, **kwargs):
        super(Chess, self).__init__(*args, **kwargs)
        self.white_player = player_one or Player(White())
        self.black_player = player_two or Player(Black())

    @staticmethod
    def _piece_exists(piece):
        return piece is not None

    def _location_occupied(self, color, location):
        loc_piece = self.board_rep[location]
        if loc_piece is None:
            return False
        if loc_piece.color.__class__ != color.__class__:
            return False
        return True

    def _location_checks(self, *args):
        for location in args:
            if not self.location_exists(location):
                raise NoLocationException

    def _handle_side_effects(self, side_effects=None):
        pass

    def _piece_checks(self, piece, player, next_location):
        if not self._piece_exists(piece):
            raise NoPieceException
        if self._location_occupied(piece.color, next_location):
            raise LocationOccupiedException
        if piece.color != player.color:
            raise NotYourPieceException

    def get_white_player(self):
        return self.white_player

    def get_black_player(self):
        return self.black_player

    def get_board_state(self):
        return {
            tile: piece.representation
            for tile, piece in self.board_rep.items()
            if piece
        }

    def move(self, current_location, next_location, player):
        # Check move legality at the board level
        self._location_checks(current_location, next_location)
        piece = self.board_rep[current_location]
        self._piece_checks(piece, player, next_location)
        # Check move legality at the piece level
        side_effects = piece.update(current_location, next_location, self.board_rep)
        if side_effects:
            self._handle_side_effects(side_effects)

        # Do the move
        self.board_rep[current_location] = None
        self.board_rep[next_location] = piece
        return self.board_rep
