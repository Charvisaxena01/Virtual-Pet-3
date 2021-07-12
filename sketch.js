//Create variables here
var dog,dog1,happyDog,database,foodS,foodStock;
var feedPet,addFood;
var fedTime,lastFed;
var foodOj;
var chgGS,readGS;
var bedroom,garden,washroom;
var gameState;


function preload()
{
  dog1 = loadImage("images/dogImg.png")
  happyDog = loadImage("images/dogImg1.png")
  bedroom = loadImage("pet/Bed Room.png")
  garden = loadImage("pet/Garden.png")
  washroom= loadImage("pet/Wash Room.png")


	//load images here
}

function setup() {

  database = firebase.database()
  createCanvas(1000, 500);

  foodOj = new Food()

 foodStock = database.ref('Food');
 foodStock.on("value",readStock);

  dog = createSprite(800,200,150,150)
  dog.addImage(dog1)
  dog.scale = 0.5
  
 feedPet = createButton("Feed the dog")
 feedPet.position(700,95)
 feedPet.mousePressed(feedDog);

 addFood = createButton("Add Food")
 addFood.position(800,95)
 addFood.mousePressed(addFoods)
 
//read gamestate from database
readGS = database.ref('gameState');
readGS.on("value",function(data){
  gameState = data.val()
});




  
}


function draw() {  
  background("brown")
  drawSprites();
  //add styles here
  foodOj.display()


      fedTime = database.ref('FeedTime')
      fedTime.on("value",function(data){
        lastFed = data.val()
      });
   fill(255,255,254)
   textSize(15)
   if(lastFed>=12){
     text("LastFeed :" + lastFed%12+"PM", 350,30)
   }else if(lastFed == 0){
     text("Last Feed : 12 AM", 350,30)

   }else{
     text("Last Feed : " + lastFed+"AM",350,30)
   }
  if(gameState!="Hungry"){
    feedPet.hide()
    addFood.hide()
    dog.remove()
  }else{
    dog.addImage(dog1)
    feedPet.show()
    addFood.show()
  
  }
   currentTime = hour()
   if(currentTime==(lastFed+1)){
   
     update("Playing")
     foodOj.garden()
   }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodOj.bedroom()

   }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
     update("Bathing")
     foodOj.washroom()
   }else{
     update("Hungry")
       foodOj.display()
     }
    

}


  

  

function readStock(data){
  foodS=data.val();
  foodOj.updateFoodStock(foodS)
}
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}
function feedDog(){
  dog.addImage(happyDog)
  
  foodOj.updateFoodStock(foodOj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodOj.getFoodStock(),
    fedTime:hour()
    
  })
}
 function addFoods(){
   foodS++;
   
   database.ref('/').update({
     Food:foodS
   })
 }
function update(state){
  database.ref('/').update({
    gameState:state
  });
}





