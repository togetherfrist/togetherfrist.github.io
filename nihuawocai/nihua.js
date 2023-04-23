const ws = require('ws');
;((ws)=>{
    const server = new ws.Server({port:8000});
    const init = () => {
        bindEvent();
    }

    var renshu = 0
    var wanjia = []
    var dengdairenshu = 0
    var kaishijishu = 0
    var wancheng = 0
    var huihe = 1
    var shunxu = [[]]
    var hua = [[]]
    var ren = [[]]
    var zonghuihe = 0
    var isingame = false
    var host = null
    var timeout
    var isxiangsuhua

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
        //console.log(msg.toString('utf8'));
        var json1 = JSON.parse(msg.toString('utf8'))
        switch(json1.type){
            case "message":
                sendbuf(msg)
                break
            case "askforstart":
                sendbuf(msg)
                kaishijishu = 0
                dengdairenshu = 0
                wanjia = []
                console.log("that zonghuihe == " + json1.zonghuihe)
                if(json1.zonghuihe == 0 || json1.zonghuihe.zonghuihe == NaN){
                    zonghuihe = server.clients.size
                }else{
                    zonghuihe = json1.zonghuihe
                }
                console.log("this zonghuihe == " + zonghuihe)
                zongshijian = json1.shijianbeilv * 150
                isxiangsuhua = json1.isxiangsuhua
                break
            case "start":
                renshu = server.clients.size
                console.log("renshu == " + renshu)
                if(json1.user != null){
                    wanjia[kaishijishu] = json1.user
                    kaishijishu += 1
                    console.log(kaishijishu)
                }
                if(kaishijishu == renshu){
                    console.log("start")
                    isingame = true
                    wancheng = 0
                    console.log("zonghuihe == " + zonghuihe)
                    console.log("zongshijian == " + zongshijian)
                    huihe = 1
                    hua = [[]]
                    shunxu = [[]]
                    ren = [[]]
                    for(i = 0; i < renshu; i++){
                        shunxu[i] = []
                        for(j = 0; j < renshu; j++){
                            shunxu[i][j] = (i + j) % renshu
                        }
                    }
                    for(i = 0; i < 30; i++){
                            var r1 = randbelow(renshu)
                            var r2 = randbelow(renshu - 1)
                            if(r2 == r1) r2 = renshu - 1
                        if(i % 2 == 0){
                            var li = shunxu[r1]
                            shunxu[r1] = shunxu[r2]
                            shunxu[r2] = li
                        }else{
                            for(j = 0; j < renshu; j++){
                                var li = shunxu[j][r1]
                                shunxu[j][r1] = shunxu[j][r2]
                                shunxu[j][r2] = li
                            }
                        }
                    }
                    for(i = renshu; i < zonghuihe; i++){
                        shunxu[i] = shunxu[i % renshu]
                    }
                    
                    json1.message = shunxu
                    json1.zongshijian = zongshijian
                    json1.wanjia = wanjia
                    json1.isxiangsuhua = isxiangsuhua
                    console.log(json1)
                    sendjson(json1)
                    timeout = setTimeout(() => {
                        json1.type = "jieshuchuti"
                        sendjson(json1)
                    }, zongshijian * 0.3 * 1000);
                }
                
                break
            case "username":
                
                if(isingame){
                    var newuid = null
                    for(i = 0; i < wanjia.length; i++){
                        if(wanjia[i] == json1.user){
                            newuid = i
                        }
                    }
                    if(newuid != null && renshu + dengdairenshu >= server.clients.size){
                        json1.type = "backtogame"
                        json1.uid = newuid
                        json1.shunxu = shunxu
                        json1.now = ["backtodraw","backtocai"][huihe % 2]
                        json1.wanjia = wanjia
                        json1.isxiangsuhua = isxiangsuhua
                        sendjson(json1)
                    }else{
                        dengdairenshu += 1
                        json1.type = "dengdai"
                        json1.wanjia = wanjia
                        sendjson(json1)

                    }

                }else if (host == null || host == json1.user){
                    wanjia[wanjia.length] = json1.user
                    host = json1.user
                    json1.type = "join"
                    json1.wanjia = wanjia
                    sendjson(json1)
                    json1.type = "host"
                    json1.host = host
                    sendjson(json1)
                }else{
                    wanjia[wanjia.length] = json1.user
                    json1.type = "join"
                    json1.wanjia = wanjia
                    sendjson(json1)
                }
                break
            case "chuti":
            case "huawanle":
            case "caice":
                if(["huawanle","caice"][huihe % 2] == json1.type || ["huawanle","chuti"][huihe % 2] == json1.type){
                    var weizhi = shunxu[huihe - 1].indexOf(json1.uid)
                    if(hua[huihe - 1] == undefined){
                        hua[huihe - 1] = []
                        ren[huihe - 1] = []
                    }
                    if(hua[huihe - 1][weizhi] == undefined){
                        console.log("someone finished")
                        wancheng += 1
                        hua[huihe - 1][weizhi] = 0
                    }else{
                        console.log("更改了画")
                    }
                    console.log("完成人数为 " + wancheng)
                    console.log("总人数为 " + (server.clients.size - dengdairenshu))

                    ren[huihe - 1][weizhi] = json1.user
                    if(wancheng >= server.clients.size - dengdairenshu){
                        clearTimeout(timeout)
                        if(huihe == zonghuihe){
                            json1.type = "end"
                            isingame = false
                        }else{
                            if (json1.type == "chuti" || json1.type == "caice"){
                                json1.type = "draw"
                                timeout = setTimeout(() => {
                                    json1.type = "jieshuhuahua"
                                    sendjson(json1)
                                }, zongshijian * 1000);
                            }else if (json1.type == "huawanle"){
                                json1.type = "cai"
                                timeout = setTimeout(() => {
                                    json1.type = "jieshucaice"
                                    sendjson(json1)
                                }, zongshijian * 0.3 * 1000);
                            }
                        }    
                        json1.ren = ren[huihe - 1]
                        json1.message = [wancheng, server.clients.size, huihe - 1, weizhi, json1.message]
                        wancheng = 0
                        huihe += 1
                        json1.huihe = huihe
                    }else{
                        json1.message = [wancheng, server.clients.size, huihe - 1, weizhi, json1.message]
                    }
                    
                    sendjson(json1)
                }
                break
        }
    }
    function randbelow(int){
        return Math.floor(Math.random()*int) 
    }
    init();
})(ws);