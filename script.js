const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

/*Rough sketch of the pattern to be used: Array is shuffled and expanded into a 2d array
with each color having a "flipped" and a "matched" boolean. Then once put into html Div
instead of the color being stored in the class, the array index is. Then, when the click
handler pulls the class of the dive it pulls the array index, comparing it to the previous
flipped card if there is one, setting it as the previous card if not, and unflipping the two
previous cards if they weren't matches. The createDiv function will serve to keep the 
screen updated to the created array */

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  //initialize the 2d array tracking flipped and matched status
  let fullArray = [];
  for(let color of array) fullArray.push({"color":color, "flipped":false,"matched":false});

  return fullArray;
}
//initialize primary array and score variable
let shuffledColors = shuffle(COLORS);
let score = 0;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let matches = 0;
  //clear the board so that the card gets re-rendered
  while(gameContainer.childElementCount>0) gameContainer.firstChild.remove();
  for (let i = 0; i< colorArray.length;i++) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the index of the value stored there
    newDiv.classList.add(i);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    //if the index is matched or flipped, leave the color showing
    if(shuffledColors[i]["matched"] || shuffledColors[i]["flipped"]) newDiv.style.backgroundColor = shuffledColors[i]["color"];

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    //count total matched cards. if all the cards are matched it counts as a victory and the score is recorded
    if(shuffledColors[i]["matched"]) matches++;
  }
  if(matches == colorArray.length) {
    //if the current score is better than the stored score it replaces it
    if(score < localStorage.getItem("score") || localStorage.getItem("score") == null)
      localStorage.setItem("score", score);
  }
  //update the scoreboard
  console.log(localStorage.getItem("score"));
  document.getElementById("scoreboard").innerText = "Current: " + score + " Best: " + localStorage.getItem("score");
}
//initialize the varables tracking information of previous clicks
let prev = -1;
let flipped = 0;
function handleCardClick(event) {
  //get index of the clicked card
  let index = event.target.classList[0];

  //Pull the index from the html object and see if it is already flipped, ignoring the click if so
  if(!shuffledColors[index]["flipped"] && !shuffledColors[index]["matched"] && flipped <2){
    //set the card to flipped in the master array
    shuffledColors[index]["flipped"] = true;

    //if there are no previously flipped cards put the current index into the previous card var
    if(flipped ===0) prev = index;
    //if there is one card flipped compare the current card to the previous card
    if(flipped === 1){
      //if the two cards match, set both of their respective "matched" variables to true
      if(shuffledColors[index]["color"] === shuffledColors[prev]["color"]){
        shuffledColors[index]["matched"] = true;
        shuffledColors[prev]["matched"] = true;
        //reset the flipped counter to keep the game flow moving
        flipped = -1;
        score++;
      }
    }
    //increment the card counter
    flipped++;
    //unflip all the cards if there are two cards already flipped
    if(flipped ===2){
      //put the reset logic in a timeout function to force the player to wait a second before another guess
      setTimeout(()=>{
        //unflip all the cards so that the render function and double click check will reset the board
        for(let card of shuffledColors) card["flipped"] = false;
        //reset the flip counter
        flipped = 0;
        score++;
        console.log("The timeout ran");
        createDivsForColors(shuffledColors);
      },1000)
    } 
  }
  createDivsForColors(shuffledColors);
}

//event handler for start and reset buttons
document.getElementById("start").addEventListener("click",(event)=>{
  score = 0;
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  event.target.innerText = "Reset";
})