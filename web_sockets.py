from random import getrandbits
from enum import Enum
from flask import request
from flask_socketio import Namespace, emit, join_room, leave_room

from game.chess_game import Chess


class Events(Enum):
    # Emittables
    PLAYER_IDENTIFIED = 'playerIdentified'


class Keys(Enum):
    PLAYER = 'player'
    PLAYER_ID = 'playerId'
    BOARD_STATE = 'boardState'
    ROOM = 'room'


class GameCore(Namespace):
    def __init__(self, *args, **kwargs):
        super(GameCore, self).__init__(*args, **kwargs)
        self.current_unfilled_room = ''
        self.game_rooms = {}
        self.players = {}

    def _join_or_create_game(self, player_id):
        if self.current_unfilled_room: # Room already has one player
            room = self.current_unfilled_room
            game = self.game_rooms[room]
            join_room(room)
            self.players[player_id] = game.get_black_player()
            print(f'Player {player_id[:5]}... joined the game')
            self.current_unfilled_room = ''
            return room, game, 'B'
        new_room = str(getrandbits(128))
        self.current_unfilled_room = new_room
        new_game = Chess()
        self.game_rooms[new_room] = new_game
        self.players[player_id] = new_game.get_white_player()
        join_room(new_room)
        print(f'Player {player_id[:5]}... joined a new game')
        return new_room, new_game, 'W'

    @staticmethod
    def on_connect():
        print('New player connected')

    def on_disconnect(self):
        for room in self.rooms(request.sid):
            leave_room(room)
        print(f'Player {request.sid[:5]}... has left the game')

    @staticmethod
    def on_move(data):
        print(f'Player {request.sid[:5]}... wants to move {data["pieceKey"]} to {data["location"]}')

    def on_join_game(self):
        player_id = request.sid
        room, game, color = self._join_or_create_game(player_id)
        data = {
            Keys.PLAYER.value: {'id': player_id, 'color': color},
            Keys.ROOM.value: room,
            Keys.BOARD_STATE.value: game.get_board_state(),
        }
        emit(Events.PLAYER_IDENTIFIED.value, data)
