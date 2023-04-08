(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"ws":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[1]);
