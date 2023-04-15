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
    var host = ""
    function handleConnection(ws){
        console.log('WebSocket connection');
        ws.on('message',handleMessage);
    }
    function handleMessage(msg){
        console.log('WebSocket message');
        console.log(msg.toString('utf8'));
        var json1 = JSON.parse(msg.toString('utf8'))
        switch(json1.type){
            case "message":
                server.clients.forEach(function(c){
                    c.send(msg);
                })
                break
            case "start":
                console.log("start")
                var renshu = server.clients.size
                server.clients.forEach(function(c){
                    c.send(msg);
                })
                break
            case "username":
                if(host == ""){
                    host = json1.user
                    console.log("host == " + host)
                }
                if(json1.user == host){
                    server.clients.forEach(function(c){
                        c.send(msg);
                    })
                }
                break
        }
    }
    init();
})(ws);