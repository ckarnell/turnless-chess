# pylint: disable=unused-import
from app import app, socketio
from web_sockets import GameCore
from game import Chess
from views import index

if __name__ == '__main__':
    socketio.on_namespace(GameCore('/'))
    socketio.run(app, port=5000, use_reloader=True)
