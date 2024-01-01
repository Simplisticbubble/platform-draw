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

socket.on("connect", () => {
    console.log("connected");
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
function loop(){
    
    for(const player of players){
        canvas.drawImage(santaImage, player.x, player.y);
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);