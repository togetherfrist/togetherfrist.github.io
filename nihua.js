const ws = require('ws');
;((ws)=>{
    const server = new ws.Server({port:8000});
    const init = () => {
        bindEvent();
    }

    function bindEvent() {
        server.on('open',handleOpen);
        server.on('close',handleClose);
        server.on('error',handleError);
        server.on('connection',handleConnection);
    }
    function handleOpen(){
        console.log('WebSocket open');
    }
    function handleClose(){
        console.log('WebSocket close');
    }
    function handleError(){
        console.log('WebSocket error');
    }
    function handleConnection(ws){
        console.log('WebSocket connection');
        ws.on('message',handleMessage);
    }
    function handleMessage(msg){
        console.log('WebSocket message');
        console.log(msg);
        server.clients.forEach(function(c){
            c.send(msg);
        })
    }
    init();
})(ws);