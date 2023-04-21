const ws = require('ws');
;((ws)=>{
    const server = new ws.Server({port:8000});
    const init = () => {
        bindEvent();
    }

    var renshu = 0
    var uidlist = []
    var wanjia = []
    var dengdai = []
    var agreenumber
    var wancheng = 0
    var huihe = 1
    var shunxu = [[]]
    var hua = [[]]
    var ren = [[]]
    var zonghuihe = 0
    var isingame = false

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
        console.log("size == " + server.clients.size)
        ws.on('message',handleMessage);
        ws.on("close",() => {
            console.log("someone disconnected")
            console.log("size == " + server.clients.size)
        })
    }
    function sendbuf(buffer){
        server.clients.forEach(function(c){
            c.send(buffer);
        })
    }
    function sendjson(json1){
        server.clients.forEach(function(c){
            c.send(Buffer.from(JSON.stringify(json1)));
        })
    }

    function handleMessage(msg){
        console.log('WebSocket message');
        console.log(msg.toString('utf8'));
        var json1 = JSON.parse(msg.toString('utf8'))
        switch(json1.type){
            case "message":
                sendbuf(msg)
                break
            case "start":
                console.log("start")
                console.log("renshu == " + renshu)
                isingame = true
                wancheng = 0
                if(json1.zonghuihe == "" || json1.zonghuihe.zonghuihe == NaN){
                    zonghuihe = renshu
                }else if(typeof(json1.zonghuihe) == 'number'){
                    zonghuihe = json1.zonghuihe
                }
                zongshijian = json1.shijianbeilv * 150
                console.log("zonghuihe == " + zonghuihe)
                console.log("zongshijian == " + zongshijian)
                huihe = 1
                hua = [[]]
                shunxu = [[]]
                for(i = 0; i < zonghuihe; i++){
                    shunxu[i] = []
                    for(j = 0; j < renshu; j++){
                        shunxu[i][j] = (i + j) % renshu
                    }
                }
                for(i = 0; i < 30; i++){
                    
                    if(i % 2 == 0){
                        var r1 = randbelow(zonghuihe)
                        var r2 = randbelow(zonghuihe - 1)
                        if(r2 == r1) r2 = zonghuihe - 1
                        var li = shunxu[r1]
                        shunxu[r1] = shunxu[r2]
                        shunxu[r2] = li
                    } else{
                        var r1 = randbelow(renshu)
                        var r2 = randbelow(renshu - 1)
                        if(r2 == r1) r2 = renshu - 1
                        for(j = 0; j < zonghuihe; j++){
                            var li = shunxu[j][r1]
                            shunxu[j][r1] = shunxu[j][r2]
                            shunxu[j][r2] = li
                        }
                    }
                    
                }
                json1.message = shunxu
                json1.zongshijian = zongshijian
                console.log(json1)
                sendjson(json1)
                break
            case "username":
                if(isingame){
                    json1.type = "askforin"
                    sendjson(json1)
                }else{
                    renshu += 1
                    wanjia.push(json1.user)
                    var newuid
                    if (uidlist.length == 0){
                        newuid = 0
                    }else{
                        newuid = uidlist.length
                        for(i = 0; i < uidlist.length; i++){
                            if(uidlist[i] == null){
                                newuid = i
                            }
                        }
                    }
                    
                    json1.message = newuid
                    json1.wanjia = wanjia
                    uidlist[newuid] = newuid
                    sendjson(json1)
                    if(renshu == 1){
                        json1.type = "host"
                        sendjson(json1)
                    }
                }
                break
            case "disagree":
                sendjson(json1)
                break
            case "agree":
                agreenumber += 1
                if(agreenumber == renshu){
                    sendjson(json1)
                }
                break
            case "exit":
                renshu -= 1
                uidlist[json1.uid] = null
                wanjia.splice(wanjia.indexOf(json1.user), 1)
                break
            case "chuti":
            case "huawanle":
            case "caice":
                var weizhi = shunxu[huihe - 1].indexOf(json1.uid)
                if(hua[huihe - 1] == undefined){
                    hua[huihe - 1] = []
                    ren[huihe - 1] = []
                }
                if(hua[huihe - 1][weizhi] == undefined){
                    wancheng += 1
                }
                hua[huihe - 1][weizhi] = json1.message
                ren[huihe - 1][weizhi] = json1.user
                console.log(hua)
                if(wancheng == renshu){
                    if(huihe == zonghuihe){
                        json1.type = "end"
                        isingame = false
                    }else{
                        if (json1.type == "chuti" || json1.type == "caice"){
                            json1.type = "draw"
                        }else if (json1.type == "huawanle"){
                            json1.type = "cai"
                        }
                    }    
                    json1.message = hua[huihe - 1]
                    json1.ren = ren[huihe - 1]
                    wancheng = 0
                    huihe += 1
                    json1.huihe = huihe
                }else{
                    json1.message = [wancheng,renshu]
                }
                sendjson(json1)
                break
        }
    }
    function randbelow(int){
        return Math.floor(Math.random()*int) 
    }
    init();
})(ws);