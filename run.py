# pylint: disable=unused-import
from app import app, socketio
from web_sockets import GameEvents
from game import Chess
from views import index

if __name__ == '__main__':
    socketio.run(app, port=5000, use_reloader=True)
