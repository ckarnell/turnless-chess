PIECE_SYMBOL_MAP = {
    'Wp': '♟',
    'Wr': '♜',
    'Wn': '♞',
    'Wb': '♝',
    'Wq': '♛',
    'Wk': '♚',
    'Bp': '♙',
    'Br': '♖',
    'Bn': '♘',
    'Bb': '♗',
    'Bq': '♕',
    'Bk': '♔',
}

class IllegalMoveException(Exception):
    pass


class Piece():
    def __init__(self, color=None):
        self.color = color
        self.dirty = False
        char = getattr(self, 'char', None)
        self.representation = f'{self.color.char}{char}'
        self.symbol = PIECE_SYMBOL_MAP[self.representation]
        self.direction = self.color.direction
        self.perpendicular_moves = [self._one_forward,
                                    self._one_backward,
                                    self._one_left,
                                    self._one_right]
        self.diagonal_moves = [self._one_forward_right,
                               self._one_backward_right,
                               self._one_forward_left,
                               self._one_backward_right]
        self.potential_move_funcs = []

    def _filter_moves(self, moves_list, board_rep):
        return [
            move for move in moves_list
            if move in board_rep and # Space exists
            (board_rep[move] is None # Space is empty
             or board_rep[move].color != self.color) # Space is occupied by enemy piece
        ]

    def _possible_moves(self, current_location, board_rep, move_functions=None):
        move_functions = move_functions or []
        result = {}
        for move_function in move_functions:
            potential_move = move_function(current_location)
            while potential_move in board_rep and board_rep[potential_move] is None:
                result[potential_move] = {}
                potential_move = move_function(potential_move)
            if potential_move in board_rep:
                # The space is occupied, but you can still move there unless it's your own piece
                if board_rep[potential_move].color != self.color:
                    result[potential_move] = {}
        return result


    def _one_forward(self, current_location):
        return f'{current_location[0]}{int(current_location[1])+self.direction}'

    def _one_backward(self, current_location):
        return f'{current_location[0]}{int(current_location[1])-self.direction}'

    @staticmethod
    def _one_left(current_location):
        return f'{chr(ord(current_location[0])-1)}{int(current_location[1])}'

    @staticmethod
    def _one_right(current_location):
        return f'{chr(ord(current_location[0])+1)}{int(current_location[1])}'

    def _one_forward_right(self, current_location):
        forward = self._one_forward(current_location)
        return self._one_right(forward)

    def _one_backward_right(self, current_location):
        backward = self._one_backward(current_location)
        return self._one_right(backward)

    def _one_forward_left(self, current_location):
        forward = self._one_forward(current_location)
        return self._one_left(forward)

    def _one_backward_left(self, current_location):
        backward = self._one_backward(current_location)
        return self._one_left(backward)

    def _clean_metadata(self, meta):
        '''
        Clean up metadata, with the assumption that a move is about to happen
        '''
        if not self.dirty:
            self.dirty = True
        for key, value in meta.items():
            setattr(self, key, value)

    def update(self, current_location, next_location, board_rep):
        moves = self._possible_moves(current_location, board_rep, self.potential_move_funcs)
        if next_location not in moves:
            raise IllegalMoveException
        self._clean_metadata(moves[next_location])


class Pawn(Piece):
    char = 'p'

    def __init__(self, *args, **kwargs):
        super(Pawn, self).__init__(*args, **kwargs)
        self.can_en_passant = False
        self.vulnerable_to_en_passant = False
        self.one_forward = False
        self.promote = False

    def _possible_moves(self, current_location, board_rep):
        result = {}
        one_forward = self._one_forward(current_location)
        if board_rep[one_forward] is None:
            result[one_forward] = {'one_forward': True}
            two_forward = self._one_forward(one_forward)
            if board_rep[two_forward] is None and not self.dirty:
                result[two_forward] = {'vulnerable_to_en_passant': True}

        # Attackable spaces
        one_forward_right = self._one_forward_right(current_location)
        one_forward_left = self._one_forward_left(current_location)
        for move in self._filter_moves([one_forward_left, one_forward_right], board_rep):
            result[move] = {}
        return result

    def _clean_metadata(self, meta):
        super(Pawn, self)._clean_metadata(meta)
        if self.can_en_passant:
            self.can_en_passant = False
        for key, value in meta.items():
            setattr(self, key, value)

    def update(self, current_location, next_location, board_rep):
        moves = self._possible_moves(current_location, board_rep)
        if next_location not in moves:
            raise IllegalMoveException
        return self._clean_metadata(moves[next_location])


class Rook(Piece):
    char = 'r'

    def __init__(self, *args, **kwargs):
        super(Rook, self).__init__(*args, **kwargs)
        self.potential_move_funcs = self.perpendicular_moves


class Knight(Piece):
    char = 'n'

    def _possible_moves(self, current_location, board_rep):
        moves_list = [hor(hor(vert(current_location))) for hor in self.perpendicular_moves[:2]
                      for vert in self.perpendicular_moves[2:]]
        moves_list += [vert(vert(hor(current_location))) for hor in self.perpendicular_moves[:2]
                       for vert in self.perpendicular_moves[2:]]
        moves_list = self._filter_moves(moves_list, board_rep)
        return {move: {} for move in moves_list}

    def update(self, current_location, next_location, board_rep):
        moves = self._possible_moves(current_location, board_rep)
        if next_location not in moves:
            raise IllegalMoveException
        self._clean_metadata(moves[next_location])


class Bishop(Piece):
    char = 'b'

    def update(self, current_location, next_location, board_rep):
        moves = self._possible_moves(current_location, board_rep, self.diagonal_moves)
        if next_location not in moves:
            raise IllegalMoveException
        self._clean_metadata(moves[next_location])


class Queen(Piece):
    char = 'q'

    def update(self, current_location, next_location, board_rep):
        move_functions = self.diagonal_moves + self.perpendicular_moves
        moves = self._possible_moves(current_location, board_rep, move_functions)
        if next_location not in moves:
            raise IllegalMoveException
        self._clean_metadata(moves[next_location])


class King(Piece):
    char = 'k'

    def __init__(self, *args, **kwargs):
        super(King, self).__init__(*args, **kwargs)

    def _possible_moves(self, current_location, board_rep, move_functions=None):
        moves_list = [move_function(current_location) for move_function in move_functions]
        moves_list = self._filter_moves(moves_list, board_rep)
        return {move: {} for move in moves_list}

    def update(self, current_location, next_location, board_rep):
        move_functions = self.diagonal_moves + self.perpendicular_moves
        moves = self._possible_moves(current_location, board_rep, move_functions)
        if next_location not in moves:
            raise IllegalMoveException
        self._clean_metadata(moves[next_location])
