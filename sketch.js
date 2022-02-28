
var trex ,trexR,trexM;
var piso, pisoM,pisoV;
var clouds, cloudI;
var frameDelta1 = 0,frameDelta2 = 0;
var obstacles;
var obstacle;
var gameover,gameoverI;
var puntaje = 0,maxScore=0;
var vel = 0.5;
var estado = "play"

function preload(){
  trexR = loadAnimation("trex1.png","trex3.png","trex4.png");
  pisoM = loadAnimation("ground2.png");
  cloudI = loadImage("cloud.png");
  obstacles = [loadImage("obstacle1.png"),loadImage("obstacle2.png"),loadImage("obstacle3.png"),
loadImage("obstacle4.png"),loadImage("obstacle5.png"),loadImage("obstacle6.png")]
  trexM = loadAnimation("trex_collided.png")
  gameoverI = loadImage("gameOver.png");
}

function setup(){
  createCanvas(600,300);
  textSize(15)
  //create sprites
  trex = createSprite(50,260,20,50);
  piso = createSprite(0,299,600,10);
  pisoV = createSprite(0,290,10,10);
  gameover = createSprite(300,150);
  clouds = [];
  
  trex.addAnimation("running", trexR);
  trex.addAnimation("death",trexM);
  trex.depth = 2  
  pisoV.addAnimation("moving",pisoM);
  piso.visible = false;
  gameover.addImage(gameoverI);
  gameover.visible = false
  //escalar Trex
  trex.scale = 0.75;
}

function draw(){
  background("white")
  
  switch(estado){
    case"play":

      trex.collide(piso);
      if((keyDown("space")||keyDown("w")||keyDown("up"))&&trex.y+trex.height/2>260){
        trex.velocityY -=10
      }
      spawnClouds();
      spawnObstacles();
      moverPiso()
      trex.velocityY +=2;
      puntaje ++;
      if(obstacle != null&&trex.isTouching(obstacle)){
        estado = "gameover"
        trex.velocityY = 0
        trex.changeAnimation("death")
        obstacle.velocityX=0;
        if(clouds != null){
          clouds.forEach(function(cloud,index,array){
             cloud.velocityX = 0;            
          })
        }
        if(puntaje>maxScore){
          maxScore = puntaje
        }
        puntaje = 0;
        gameover.visible = true;
        
      }
      vel = puntaje/1000 +1;
      
      
      break;
    case "gameover":
      
      if(keyDown("enter")){
        gameover.visible = false;
        if(clouds!=null){
          clouds.forEach(function(cloud,index,array){cloud.lifetime= 0})
          clouds.splice(0,clouds.lenght);
        }
        obstacle.lifetime= 0;
        estado = "play"
        trex.changeAnimation("running")
      }
      textSize(30)
      text("Pulsa enter para reiniciar", 150,200)
      textSize(15)     
      break;
  }
  text("Max Score: "+maxScore+" Score: "+puntaje,400,50)
  drawSprites();
}
function moverPiso(){
  pisoV.x-=10*vel;
  if(pisoV.x<-600){
    pisoV.x= 590;
  }
}
function spawnClouds(){
  if((frameCount % round(random(70,60))==0)&&(frameDelta1 >180/vel)){
    frameDelta1=0;
    var cloud = createSprite(700,random(cloudI.height/2,150),50,10);
    cloud.velocityX=-1*vel;
    cloud.addImage(cloudI);
    cloud.depth = trex.depth-1
    cloud.lifetime = 800/vel;
    clouds.push(cloud);
  }

  frameDelta1++;
}
function spawnObstacles(){
  if((frameCount % round(random(70,60))==0)&&(frameDelta2 >60/vel)){
    frameDelta2=0;
    obstacle = createSprite(700,265,50,10);
    obstacle.velocityX=-10*vel;
    obstacle.addImage(obstacles[round(random(0,5))]);
    obstacle.depth = trex.depth-1
    obstacle.lifetime = 800/vel;
    obstacle.scale = 0.75
  }

  frameDelta2++;
}