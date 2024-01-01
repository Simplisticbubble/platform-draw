const express = require('express');
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
const  httpServer = createServer(app);

const io = new Server(httpServer);


const SPEED = 5;
const TICK_RATE = 30;
const PLAYER_SIZE = 32;
let players = [];
let decal2D = [[]];
const inputsMap = {}
function tick(delta) {
    for(const player of players){
        const inputs = inputsMap[player.id];
        const previousY = player.y;
        const previousX = player.x;
        if(inputs.up){
            player.y -= SPEED;
        }else if(inputs.down){
            player.y +=SPEED;
        }
        // if(isCollidingWithMap(player)){
        //     player.y = previousY;
        // }

        if(inputs.right){
            player.x += SPEED;
        }else if(inputs.left){
            player.x -=SPEED;
        }
        // if(isCollidingWithMap(player)){
        //     player.x = previousX;
        // }
        
    }
    io.emit('players', players);
}
async function main(){
    
    io.on('connect', (socket) => {
        console.log('user connected', socket.id);

        inputsMap[socket.id] = {
            up: false,
            down: false,
            left: false,
            right: false,
        }
        players.push({
            id: socket.id,
            x: 0,
            y: 0,
        })

        socket.on('inputs', (inputs) => {
            inputsMap[socket.id] = inputs;
        });


        socket.on('disconnect', ()=>{
            players = players.filter((player) => player.id !== socket.id);
        })
        socket.on("rect", (startX, startY, width, height)=>{
            const rectangle = {
                x: startX,
                y: startY,
                width,
                height,
            };
            
            decal2D.push(rectangle);
            io.emit("updateDecalMap", decal2D);
        })
    });
    app.use(express.static("public"));
    
    httpServer.listen(5000);


    let lastUpdate = Date.now();
    setInterval(() =>{
        const now = Date.now();
        const delta = now - lastUpdate;

        tick(delta);
        lastUpdate = now;
    }, 1000/TICK_RATE)
}
main();