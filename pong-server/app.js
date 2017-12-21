const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
let game= true;
let users = [];
let velocityX = Math.floor(Math.random() * 2) ? 1 : -1;
let velocityY = Math.floor(Math.random() * 2) ? 1 : -1;

app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", function(socket){
  // Do something on connection
  // else {
    // Assign userIds to user
  if(!users[0] || users[0] === undefined){
    temp = {
      userId: socket.id,
      playerX: 20,
      playerY: 30,
      enemyX: 370,
      enemyY: 30,
      ballX: 200,
      ballY: 100,
      playerScore: 0,
      enemyScore: 0,
    }
    console.log("user 1 connected");
    users[0] = temp;
    socket.emit('update', users);
  }
  else if(!users[1] || users[1] === undefined){
    temp = {
      userId: socket.id,
      playerX: 370,
      playerY: 30,
      enemyX: 20,
      enemyY: 30,
      ballX: 200,
      ballY: 100,
      playerScore: 0,
      enemyScore: 0,
    }
    console.log("user 2 connected");
    users[1] = temp;
    socket.emit('update', users);
  }

  socket.on("disconnect", () => {
    if(users[0] != undefined && socket.id === users[0].userId){
      // users.splice(0,1);
      console.log("user 1 disconnected")
      delete users[0];
      socket.emit('update', users);
    }
    else if(users[1] != undefined && socket.id === users[1].userId){
      // users.splice(1, 2);
      console.log("user 2 disconnected")
      delete users[1];
      socket.emit('update', users);
    }
  });
  if(users[0] && users[1]){
    // Play game
      io.sockets.connected[users[0].userId].emit("GetData", users[0])
      io.sockets.connected[users[1].userId].emit("GetData", users[1])

      socket.on("BtnPress", (btn) => {
        let msg = movePlayer(btn, socket);
        socket.emit("BtnPress", `this user pressed a button ${msg}`)
        io.sockets.connected[users[0].userId].emit("GetData", users[0])
        io.sockets.connected[users[1].userId].emit("GetData", users[1])
      });

      let interval = setInterval(() => {
        if(users[0] && users[1]){
          let ballX = users[0].ballX;
          let ballY = users[0].ballY;

          if(ballX < 0){
            users[0].enemyScore = users[1].playerScore += 1
            users[0].ballX = users[1].ballX = 200
            users[0].ballY = users[1].ballY = 100
          }
          else if(ballX > 390){
            users[1].enemyScore = users[0].playerScore += 1 
            users[0].ballX = users[1].ballX = 200
            users[0].ballY = users[1].ballY = 100           
          }
          else if(ballY < 0 || ballY > 190){
            velocityY *= -1; 
          }
          else if((ballX < users[0].playerX + 10 
            && ballX> users[0].playerX && (ballY > users[0].playerY && ballY < users[0].playerY + 30))
            ||  (ballX + 10 > users[1].playerX && ballX + 10 < users[1].playerX + 10
            && (ballY > users[1].playerY && ballY < users[1].playerY + 30))){
                velocityX *= -1 
          }
          if(ballX < 0){
            users[0].enemyScore
          }

          users[0].ballX = users[1].ballX = users[1].ballX + velocityX;
          users[0].ballY = users[1].ballY = users[1].ballY +  velocityY;
          io.sockets.connected[users[0].userId].emit("GetData", users[0])
          io.sockets.connected[users[1].userId].emit("GetData", users[1])
        }
        else{
          clearInterval(interval);
        }
      }, 1000/60);
  }
});

let playGame = function(){
  console.log("this is the game loop")
}

let movePlayer =  (btn, socket) => {
  let msg;

  switch (btn) {

    case 38:
      //move up
      msg = "UP";

      if(socket.id === users[0].userId && users[0].playerY > 0){
        users[0].playerY = users[0].playerY - 2;
        users[1].enemyY = users[0].playerY;
      }
      else if(socket.id === users[1].userId && users[1].playerY > 0){
        users[1].playerY = users[1].playerY - 2;
        users[0].enemyY = users[1].playerY;        
      }

      socket.emit('update', users);
      break;

    case 40:
      //move down
      msg = "DOWN";

      if(socket.id === users[0].userId && users[0].playerY < 170){
        users[0].playerY = users[0].playerY + 2;
        users[1].enemyY = users[0].playerY;        
      }
      else if(socket.id === users[1].userId && users[1].playerY < 170){
        users[1].playerY = users[1].playerY + 2;
        users[0].enemyY = users[1].playerY;                
      }

      socket.emit('update', users);
      break;

    default:
      break;
  }

  return msg;
}

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));
