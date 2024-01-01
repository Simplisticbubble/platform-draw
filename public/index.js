const santaImage = new Image();
santaImage.src = './santa.png';

const canvasEl = document.getElementById('canvas');
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight; 
const canvas = canvasEl.getContext("2d");

console.log(canvasEl)

const socket = io('ws://localhost:5000');


let decalMap = [[]];
let players = [];
let isDrawing = false;
let startX, startY;
let currentX, currentY;

socket.on("connect", () => {
    console.log("connected");
});
socket.on('updateDecalMap', (decal2D)=>{
    decalMap = decal2D;
    console.log("updated");
    console.log(decalMap);
});
socket.on('players', (serverPlayers) => {
    players = serverPlayers;

})

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
}
window.addEventListener('keydown', (e) =>{
    console.log(e);
    if(e.key === 'w'){
        inputs["up"] = true;
    }else if(e.key === 's'){
        inputs["down"] = true;
    }else if(e.key === 'a'){
        inputs["left"] = true;
    }else if(e.key === 'd'){
        inputs["right"] = true;
    }
    socket.emit("inputs", inputs);
});
window.addEventListener('keyup', (e) =>{
    console.log(e);
    if(e.key === 'w'){
        inputs["up"] = false;
    }else if(e.key === 's'){
        inputs["down"] = false;
    }else if(e.key === 'a'){
        inputs["left"] = false;
    }else if(e.key === 'd'){
        inputs["right"] = false;
    }
    socket.emit("inputs", inputs);
});

canvasEl.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvasEl.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    currentX = e.clientX;
    currentY = e.clientY;

    // Draw a temporary rectangle while dragging
    canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);
    console.log("drawing");
    canvas.fillStyle = 'grey';
    canvas.fillRect(startX, startY, currentX - startX, currentY - startY);
});

canvasEl.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        socket.emit("rect", startX, startY, currentX - startX, currentY - startY)
    }
});
function loop(){
    canvas.clearRect(0,0,canvasEl.width, canvasEl.height);
    for(const rectangle of decalMap){
        canvas.fillStyle = 'black';
            canvas.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
    for(const player of players){
        console.log(player);
        canvas.drawImage(santaImage, player.x, player.y);
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);