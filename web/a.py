import asyncio
from websockets.sync.client import connect

def hello():
    with connect("ws://frp-arm.top:26131") as websocket:
        websocket.send("Hello world!")
        message = websocket.recv()
        print(f"Received: {message}")

hello()