from random import getrandbits
from enum import Enum
from flask_socketio import Namespace, send, emit, join_room, leave_room

from app import socketio

class Events(Enum):
    # Emittables
    PLAYER_IDENTIFIED = 'playerIdentified'

rooms = []

class GameEvents(Namespace):
    # @socketio.on('connect')
    def on_connect(self):
        print('this event hit too!')
        emit('my response', {'data': 'Connected'})

    # @socketio.on(Events.JOIN.value) # TODO: Delete
    def on_join(self, data):
        player_id = str(getrandbits(128))
        room_id = str(getrandbits(128))
        emit(Events.PLAYER_IDENTIFIED.value, { 'playerId': player_id })
        print('received data: {0}'.format(str(data)))

socketio.on_namespace(GameEvents('/'))
