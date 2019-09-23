var wsUri = "ws://" + document.location.host + document.location.pathname + "tablero";
var websocket = new WebSocket(wsUri);

websocket.binaryType = "arraybuffer";

websocket.onopen = function (evt) {
    OnOpen(evt);
};
websocket.onmessage = function (evt) {
    OnMessage(evt);
};
websocket.onerror = function (evt) {
    OnError(evt);
};
var output = document.getElementById('output');
function OnOpen(evt) {
    writeToScreen("Conectado a " + wsUri);
}
function OnMessage(evt) {
    console.log("received: " + evt.data);
    if (document.inputForm.receiveInstant.checked) {
        if (typeof evt.data === "string") {
            if (evt.data.charAt(0) === "A"){
                $.notify({ title: '<strong>Actividad reciente</strong></br>',  message: evt.data },{ type: 'info' });
            } else {
                drawImageText(evt.data);
            }
        } else {
            drawImageBinary(evt.data);
            $.notify({ title: '<strong>Actividad reciente</strong></br>',  message: "Pizarra completamente actualizada" },{ type: 'info' });
        }
    }
}
function OnError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}
function sendText(json) {
    console.log("sending text: " + json);
    websocket.send(json);
}
function sendBinary(bytes) {
    console.log("sending binary: " + Object.prototype.toString.call(bytes));
    websocket.send(bytes);
}