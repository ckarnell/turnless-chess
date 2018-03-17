from random import getrandbits
from enum import Enum
from flask import request
from flask_socketio import Namespace, emit, join_room, leave_room

from game.chess_game import Chess


class Events(Enum):
    # Emittables
    PLAYER_IDENTIFIED = 'playerIdentified'
    MOVE_MADE = 'move_made'


class Keys(Enum):
    PLAYER = 'player'
    PLAYER_ID = 'playerId'
    BOARD_STATE = 'boardState'
    ROOM = 'room'


class GameCore(Namespace):
    def __init__(self, *args, **kwargs):
        super(GameCore, self).__init__(*args, **kwargs)
        self.current_unfilled_room = ''
        self.room_game_map = {}
        self.player_id_instance_map = {}

    def _join_or_create_game(self, player_id):
        if self.current_unfilled_room: # Room already has one player
            room = self.current_unfilled_room
            game = self.room_game_map[room]
            join_room(room)
            self.player_id_instance_map[player_id] = game.get_black_player()
            print(f'Player {player_id[:5]}... joined the game')
            self.current_unfilled_room = ''
            return room, game, 'B'
        new_room = str(getrandbits(128))
        self.current_unfilled_room = new_room
        new_game = Chess()
        self.room_game_map[new_room] = new_game
        self.player_id_instance_map[player_id] = new_game.get_white_player()
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

    def on_move(self, data):
        print(f'Player {request.sid[:5]}... wants to move {data["fromLocation"]} to {data["toLocation"]}')
        game = self.room_game_map[data['roomId']]
        player = self.player_id_instance_map[request.sid]
        game.move(data['fromLocation'], data['toLocation'], player)
        emit(Events.MOVE_MADE.value, game.get_board_state(), room=data['roomId'])

    def on_join_game(self):
        player_id = request.sid
        room, game, color = self._join_or_create_game(player_id)
        data = {
            Keys.PLAYER.value: {'id': player_id, 'color': color},
            Keys.ROOM.value: room,
            Keys.BOARD_STATE.value: game.get_board_state(),
        }
        emit(Events.PLAYER_IDENTIFIED.value, data)
