// 导入ws
const Ws = require("ws");
((Ws) => {
  // 在8000端口开启WebSocket Server
  const wsServer = new Ws.Server({ port: 8000 });
  
  // 初始化
  const init = () => {
    bindEvent();
  };

  function bindEvent() {
    // 与前端区别：这里绑定定中无message有connection，其中的message应该在connection里绑定
    // 后端中WebSocket Server的事件
    wsServer.on("open", handleOpen);
    wsServer.on("close", handleClose);
    wsServer.on("error", handleError);
    wsServer.on("connection", handleConnection);
  }
  function handleOpen() {
    console.log("WebSocket Open");
  }
  function handleClose() {
    console.log("WebSocket Close");
  }
  function handleError() {
    console.log("WebSocket Error");
  }
  function handleConnection(ws) {
    console.log("WebSocket connected");
    // 后端的message是在connection里绑定
    // 绑定的是传入的参数WebSocket实例的message事件
    ws.on("message", handleMessage);
  }
  // 这里收到前端发送过来的message
  function handleMessage(msg) {
    // 广播收到的消息给每个客户端
    wsServer.clients.forEach(function (client) {
      // 这里发送给前端消息
      client.send(msg);
    });
  }
  init();
})(Ws);
