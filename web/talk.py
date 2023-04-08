import websockets
import asyncio

cs = set()

async def talk(websocket, path):
    try:
        while True:
            if (not websocket in cs):
                cs.add(websocket)
                msg = '欢迎：' + str(websocket.remote_address)
            else:
                msg = str(websocket.remote_address) + ' ' + str(await websocket.recv())
            await asyncio.wait([ws.send(msg) for ws in cs])
    except Exception as err:
        cs.remove(websocket)

start_server = websockets.serve(talk, '127.0.0.1', 8000)
asyncio.get_event_loop().run_until_complete(start_server)
print("success")
asyncio.get_event_loop().run_forever()
