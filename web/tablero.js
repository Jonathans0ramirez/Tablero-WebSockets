var canvas = document.getElementById("myCanvas");
var printCanvasBtn = document.getElementById("printVoucher");
var context = canvas.getContext("2d");
canvas.addEventListener("click", defineImage, false);

//Evento que inicia prepara el canvas y lo convierte en un archivo .PNG para su descarga
printCanvasBtn.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    printCanvasBtn.href = dataURL;
    $.notify({ title: '<strong>Descarga en proceso</strong></br>',  message: "La imagen se est&aacute; descargando..." },{ type: 'success' });
});

//Necesario para visualizar las ayudas (tooltips)
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

//Limpia el canvas y lo envía a todos
function clearCanvas() {
    context.clearRect(0,0,canvas.width,canvas.height);
    defineImageBinary();
}

//Función para obtener un color aleatorio
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//Función que se encarga de asignarle un color aleatorio al input color
function setRandomColor(){
    var color = document.inputForm.color;
    color.value = getRandomColor();
}

//Función que toma las coordenadas x y y
function getCurrentPos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//Función para tomar el color y la forma desde el formulario HTML5
function defineImage(evt) {
    var currentPos = getCurrentPos(evt);

    var color = document.inputForm.color;
    for (i = 0; i < document.inputForm.shape.length; i++) {
        if (document.inputForm.shape[i].checked) {
            var shape = document.inputForm.shape[i];
            break;
        }
    }

//Armamos la estructura del JSON a usar
    var json = JSON.stringify({
        "shape": shape.value,
        "color": color.value,
        "coords": {
            "x": currentPos.x,
            "y": currentPos.y
        }
    });
    drawImageText(json);
    //Condición que envía el canvas a los demás, solo si está seleccionada la opción de enviar a todos (checkbox)
    if (document.inputForm.sendInstant.checked) {
        sendText(json);
    }
}

//Pinta un punto, cuadrado o circulo, en el canvas
function drawImageText(image) {
    var json = JSON.parse(image);
    context.fillStyle = json.color;
    switch (json.shape) {
        case "circle":
            context.beginPath();
            context.arc(json.coords.x, json.coords.y, 5, 0, 2 * Math.PI, false);
            context.fill();
            break;
        case "square":
        default:
            context.fillRect(json.coords.x - 5, json.coords.y - 5, 10, 10);
            break;
    }
}

//Recrea el canvas completo
function drawImageBinary(blob) {
    var bytes = new Uint8Array(blob);

    var imageData = context.createImageData(canvas.width, canvas.height);

    for (var i = 8; i < imageData.data.length; i++) {
        imageData.data[i] = bytes[i];
    }
    context.putImageData(imageData, 0, 0);

    var img = document.createElement('img');
    img.height = canvas.height;
    img.width = canvas.width;
    img.src = canvas.toDataURL();
}

//Función para tomar cada punto del canvas
function defineImageBinary() {
    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var buffer = new ArrayBuffer(image.data.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = image.data[i];
    }
    //Condición que envía el canvas a los demás, solo si está seleccionada la opción de enviar a todos (checkbox)
    if (document.inputForm.sendInstant.checked) {
        sendBinary(buffer);
    }
}