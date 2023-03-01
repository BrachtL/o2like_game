/*

  Methods that could help me somewhere sometime {
    //ctx.lineWidth = 5;
    //ctx.fill();

    
    // First path
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(20, 20);
    ctx.lineTo(200, 20);
    ctx.stroke();

    // Second path
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(20, 20);
    ctx.lineTo(120, 120);
    ctx.stroke();
    

    //ctx.translate(width / 2, height / 2);

    //window.requestAnimationFrame(function with a recall of requestAnimationFrame);
    //window.cancelAnimationFrame(call it when the animation should stop)

    
    function loop() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, width, height);

      for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
      }

      requestAnimationFrame(loop);
    }

    loop();
  } 

*/

//constants
const width = 915; //black background width
const height = 915; //black bakground height

const x0 = 200;
const y0 = 0;

const y0Key = y0 + 850;
const keyWidth = 70;
const keyHeight = 15;

const tileHeight = keyHeight;
const tileWidth = keyWidth;

const gapKeysX0 = 100; //distance between x0 (start horizontal point) of the neighbor keys
const x0KeyS = x0 + 115;
const x0KeyD = x0KeyS + gapKeysX0;
const x0KeyF = x0KeyD + gapKeysX0;
const x0KeySpaceBar = x0KeyF + gapKeysX0;
const x0KeyJ = x0KeySpaceBar + gapKeysX0;
const x0KeyK = x0KeyJ + gapKeysX0;
const x0KeyL = x0KeyK + gapKeysX0;

//background game inicialization
let gameWindow = document.querySelector(".gameWindow");

gameWindow.width = width + x0; //game window has a white vertical rectangle aside to the left
gameWindow.height = height + y0;
//let width = canvas.width = window.innerWidth;
//let height = canvas.height = window.innerHeight;

let ctx = gameWindow.getContext("2d");

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(x0, y0, width, height);


class Key {
  constructor(color, x0Key, y0Key, keyWidth, keyHeight) {
    this.color = color,
    this.x0 = x0Key,
    this.y0 = y0Key,
    this.width = keyWidth,
    this.height = keyHeight
  }
}

class Tile {
  constructor(color, x0Tile, yTile, tileWidth, tileHeight) {
    this.color = color,
    this.x0 = x0Tile,
    this.y = yTile,
    this.width = tileWidth,
    this.height = tileHeight
  }
}

//array of keys: SDF SpaceBar JKL
const keysArray = [
  new Key("rgb(255, 0, 0)", x0KeyS, y0Key, keyWidth, keyHeight),
  new Key("rgb(255, 0, 0)", x0KeyD, y0Key, keyWidth, keyHeight),
  new Key("rgb(255, 0, 0)", x0KeyF, y0Key, keyWidth, keyHeight),
  new Key("rgb(0, 0, 255)", x0KeySpaceBar, y0Key, keyWidth, keyHeight),
  new Key("rgb(255, 0, 0)", x0KeyJ, y0Key, keyWidth, keyHeight),
  new Key("rgb(255, 0, 0)", x0KeyK, y0Key, keyWidth, keyHeight),
  new Key("rgb(255, 0, 0)", x0KeyL, y0Key, keyWidth, keyHeight)
];

function createAndLoadAudioFile(note) {
  //notes should be informed using flat notation (not sharp)

  // create an audio context
  const audioCtx = new AudioContext();

  // create seven audio sources
  const source = audioCtx.createBufferSource();

  // load seven audio files
  const audioUrl = `https://cdn.rawgit.com/fuhton/piano-mp3/master/piano-mp3/${note}.mp3`;

  fetch(audioUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => audioCtx.decodeAudioData(buffer))
    .then(decodedData => {
      source.buffer = decodedData;
    });

  // create a channel splitter
  const splitter = audioCtx.createChannelSplitter(1);

  // connect the sources to the splitter
  source.connect(splitter);

  // create two gain nodes, one for each channel
  const gainNode = audioCtx.createGain();

  // connect each channel to a gain node
  splitter.connect(gainNode, 0);

  // connect the gain nodes to the audio context destination
  gainNode.connect(audioCtx.destination);


  // set the gains for each channel
  gainNode.gain.value = 0.8; // channel 1 volume


  // start playing the audio sources
  /*
  sourceS.start();
  sourceD.start();
  sourceF.start();
  sourceSpaceBar.start();
  sourceJ.start();
  sourceK.start();
  sourceL.start();
  */

  return source

}

var noteText = "C4";
const pianoA4 = new Audio("./piano-mp3/A4.mp3");
//const pianoA4 = new Audio("https://cdn.rawgit.com/fuhton/piano-mp3/raw/master/piano-mp3/A4.mp3");
var pianoNote = new Audio(`./piano-mp3/${noteText}.mp3`);

/*
//function Switcher(audio_uri, num) {
function Switcher() {
	this.channels = [];
	this.num = num;
	this.index = 0;

  
	//or (var i = 0; i < num; i++) {
	//	this.channels.push(new Channel(audio_uri));
	//}
  

  this.channels.push(new Channel("./piano-mp3/A4.mp3"));
  this.channels.push(new Channel(`./piano-mp3/${noteText}.mp3`));

}
*/

//Switcher.prototype.play = function() {
//	this.channels[this.index++].play();
//	this.index = this.index < this.num ? this.index : 0;
//}




function drawTilesAndKeys(tilesObjectArray) {
  for(i = 0; i < tilesObjectArray.length; i++) {
    ctx.fillStyle = tilesObjectArray[i].color;
    ctx.fillRect(tilesObjectArray[i].x0, tilesObjectArray[i].y0, tilesObjectArray[i].width, tilesObjectArray[i].height);
  }
}

drawTilesAndKeys(keysArray);


let y = 0; //musicTracer (y axis position)
let sm = 256; //quarter note (seminima)

let speedInput = document.getElementById("speed");
let speedFactor = 0; // -2.5 to +2.5, step: 0.5 (HTML)
let musicSpeed;
musicSpeed = 4 + speedFactor;
//let firstHalfEnd = 1.14586 * 7 * 12812 / musicSpeed;
let firstHalfEnd2 = 12812; //12812 is the half music "length" in pixels, will value zero when it is done
  //850 - 70 + 256*47
  //850 - 70 -> distance between top of the canvas and the key height
  //256 -> sm
  // 47 -> last note of the first half is 43 and first note of the second half is 51, 47 is the middle


speedInput.addEventListener('input', function() {
  //if(speedInput.length < 3) {
    speedFactor = this.value;
    musicSpeed = 4 + 1*speedFactor; //bug do JS? se não colocar o 1 atrás não funciona!
  //}
});


//ranges to add or decrease the difficulty: more the range more the easiness
let ranges = {
  perfect: 4, //range to consider perfect: max value = range, negative number are possible, min value = -(range)
              //in the case perfect = good, never will be good notes, only perfect or miss
  good: 18 //range to consider good or miss
}

console.log(`range P: ${ranges.perfect}\nrange G: ${ranges.good}\ntype ${typeof(ranges.good)}`);


let perfect = 0, good = 0, miss = 0;


function getDifficulty() {  
  let radioDifficulty = document.querySelectorAll('input[name="difficulty"]');
  let ranges = {
    perfect: 4,
    good: 18
  }

  for (radioButton of radioDifficulty) {
    if(radioButton.checked) {
      if(radioButton.value == "easy") {
        ranges.perfect = 14;
        ranges.good = 30; 
      } else if(radioButton.value == "normal") {
        ranges.perfect = 10;
        ranges.good = 24; 
      } else if(radioButton.value == "hard") {
        ranges.perfect = 2;
        ranges.good = 16; 
      }

    }
  }
  return ranges;
}

function disableButtons() {  
  let radioDifficulty = document.querySelectorAll('input[name="difficulty"]');

  for (radioButton of radioDifficulty) {
    radioButton.disabled = true;
  }

}

function enableButtons() {
  let radioDifficulty = document.querySelectorAll('input[name="difficulty"]');

  for (radioButton of radioDifficulty) {
    radioButton.disabled = false;
  }
}




//this is the vertical position of each note
let music1TilesY = {
  keyS: [y, y-10*sm, y-12*sm, y-30*sm, y-34*sm, y-36*sm, y-51*sm, y-10*sm-51*sm, y-12*sm-51*sm, y-30*sm-51*sm, y-34*sm-51*sm, y-36*sm-51*sm],
  keyD: [y-9*sm, y-31*sm, y-33.5*sm, y-9*sm-51*sm, y-31*sm-51*sm, y-33.5*sm-51*sm],
  keyF: [y-1*sm, y-3.5*sm, y-7*sm, y-13*sm, y-15.5*sm, y-28*sm, y-32.5*sm, y-33*sm, y-37*sm, y-39.5*sm, y-43*sm, y-1*sm-51*sm, y-3.5*sm-51*sm, y-7*sm-51*sm, y-13*sm-51*sm, y-15.5*sm-51*sm, y-28*sm-51*sm, y-32.5*sm-51*sm, y-33*sm-51*sm, y-37*sm-51*sm, y-39.5*sm-51*sm, y-43*sm-51*sm],
  keySpaceBar: [y-6*sm, y-18*sm, y-42*sm, y-6*sm-51*sm, y-18*sm-51*sm, y-42*sm-51*sm],
  keyJ: [y-3*sm, y-4*sm, y-15*sm, y-16*sm, y-24*sm, y-26.5*sm, y-27.5*sm, y-39*sm, y-40*sm, y-3*sm-51*sm, y-4*sm-51*sm, y-15*sm-51*sm, y-16*sm-51*sm, y-24*sm-51*sm, y-26.5*sm-51*sm, y-27.5*sm-51*sm, y-39*sm-51*sm, y-40*sm-51*sm],
  keyK: [y-19*sm, y-25*sm, y-27*sm, y-19*sm-51*sm, y-25*sm-51*sm, y-27*sm-51*sm]
}



//arrays to store the index of music1TIles to draw
let screenNotesKeyS = [];
let screenNotesKeyD = [];
let screenNotesKeyF = [];
let screenNotesKeySpaceBar = [];
let screenNotesKeyJ = [];
let screenNotesKeyK = [];

//não estou usando essa função ainda
function drawTiles(screenNotes, y, tileColor, x0Tile, tileWidth, tileHeight) {
  for(i = 0; i < screenNotes.length; i++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(x0Tile, screenNotes[i], tileWidth, tileHeight);
  }
}

let expectingS = [];
let expectingD = [];
let expectingF = [];
let expectingSpaceBar = [];
let expectingJ = [];
let expectingK = [];


function getArrayOfNotesAndDraw(objectOfArraysOfKeys, y, lastIndexes, tileColor, keysArray, tileWidth, tileHeight) {
  
  objectOfArraysOfKeys = {
    keyS: [y, y-10*sm, y-12*sm, y-30*sm, y-34*sm, y-36*sm, y-51*sm, y-10*sm-51*sm, y-12*sm-51*sm, y-30*sm-51*sm, y-34*sm-51*sm, y-36*sm-51*sm],
    keyD: [y-9*sm, y-31*sm, y-33.5*sm, y-9*sm-51*sm, y-31*sm-51*sm, y-33.5*sm-51*sm],
    keyF: [y-1*sm, y-3.5*sm, y-7*sm, y-13*sm, y-15.5*sm, y-28*sm, y-32.5*sm, y-33*sm, y-37*sm, y-39.5*sm, y-43*sm, y-1*sm-51*sm, y-3.5*sm-51*sm, y-7*sm-51*sm, y-13*sm-51*sm, y-15.5*sm-51*sm, y-28*sm-51*sm, y-32.5*sm-51*sm, y-33*sm-51*sm, y-37*sm-51*sm, y-39.5*sm-51*sm, y-43*sm-51*sm],
    keySpaceBar: [y-6*sm, y-18*sm, y-42*sm, y-6*sm-51*sm, y-18*sm-51*sm, y-42*sm-51*sm],
    keyJ: [y-3*sm, y-4*sm, y-15*sm, y-16*sm, y-24*sm, y-26.5*sm, y-27.5*sm, y-39*sm, y-40*sm, y-3*sm-51*sm, y-4*sm-51*sm, y-15*sm-51*sm, y-16*sm-51*sm, y-24*sm-51*sm, y-26.5*sm-51*sm, y-27.5*sm-51*sm, y-39*sm-51*sm, y-40*sm-51*sm],
    keyK: [y-19*sm, y-25*sm, y-27*sm, y-19*sm-51*sm, y-25*sm-51*sm, y-27*sm-51*sm]
  }
 
  //this part search for notes that already passed the screen and don't need to be printed anymore
  for(j = 0; j < screenNotesKeyS.length; j++) { 
    if(objectOfArraysOfKeys.keyS[screenNotesKeyS[j]] > height + 100) {     
      //console.log("Estou aqui Remove notas ", j, screenNotesKeyS[j], objectOfArraysOfKeys.keyS[screenNotesKeyS[j]]);
      //delete screenNotesKeyS[j];
      //console.log(screenNotesKeyS);
      screenNotesKeyS.shift(); 
      
    }
  }

  for(j = 0; j < screenNotesKeyD.length; j++) {
    if(objectOfArraysOfKeys.keyD[screenNotesKeyD[j]] > height + 100) {
      screenNotesKeyD.shift(); 
    }
  }

  for(j = 0; j < screenNotesKeyF.length; j++) {
    if(objectOfArraysOfKeys.keyF[screenNotesKeyF[j]] > height + 100) {
      screenNotesKeyF.shift(); 
    }
  }

  for(j = 0; j < screenNotesKeySpaceBar.length; j++) {
    if(objectOfArraysOfKeys.keySpaceBar[screenNotesKeySpaceBar[j]] > height + 100) {
      screenNotesKeySpaceBar.shift(); 
    }
  }

  for(j = 0; j < screenNotesKeyJ.length; j++) {
    if(objectOfArraysOfKeys.keyJ[screenNotesKeyJ[j]] > height + 100) {
      screenNotesKeyJ.shift(); 
    }
  }

  for(j = 0; j < screenNotesKeyK.length; j++) {
    if(objectOfArraysOfKeys.keyK[screenNotesKeyK[j]] > height + 100) {
      screenNotesKeyK.shift(); 
    }
  }

 
  //this part add the notes that are coming close to the game window
  //console.log("Estive aqui", lastIndexes.screenNotesKeyS, objectOfArraysOfKeys.keyS.length, objectOfArraysOfKeys.keyS[1]);
  for(i = lastIndexes.screenNotesKeyS; i < objectOfArraysOfKeys.keyS.length; i++) {
    if(objectOfArraysOfKeys.keyS[i] < height + 100 && objectOfArraysOfKeys.keyS[i] > y0 - 100) {
      screenNotesKeyS.push(i);
      console.log("Estive aqui no screenNotesKeyS.push(i). screenNotesKeyS: ", screenNotesKeyS, "i = ", i);
      //console.log(`screenNotesKeyS: ${screenNotesKeyS}`)
      //console.log("Estive aqui: ", screenNotesKeyS);
    } else {break}
  }
  lastIndexes.screenNotesKeyS = i;


  for(i = lastIndexes.screenNotesKeyD; i < objectOfArraysOfKeys.keyD.length; i++) {
    if(objectOfArraysOfKeys.keyD[i] < height + 100 && objectOfArraysOfKeys.keyD[i] > y0 - 100) {
      screenNotesKeyD.push(i);
    } else {break}
  }
  lastIndexes.screenNotesKeyD = i;

  for(i = lastIndexes.screenNotesKeyF; i < objectOfArraysOfKeys.keyF.length; i++) {
    if(objectOfArraysOfKeys.keyF[i] < height + 100 && objectOfArraysOfKeys.keyF[i] > y0 - 100) {
      screenNotesKeyF.push(i);
    } else {break}
  }
  lastIndexes.screenNotesKeyF = i;

  for(i = lastIndexes.screenNotesKeySpaceBar; i < objectOfArraysOfKeys.keySpaceBar.length; i++) {
    if(objectOfArraysOfKeys.keySpaceBar[i] < height + 100 && objectOfArraysOfKeys.keySpaceBar[i] > y0 - 100) {
      screenNotesKeySpaceBar.push(i);
    } else {break}
  }
  lastIndexes.screenNotesKeySpaceBar = i;

  for(i = lastIndexes.screenNotesKeyJ; i < objectOfArraysOfKeys.keyJ.length; i++) {
    if(objectOfArraysOfKeys.keyJ[i] < height + 100 && objectOfArraysOfKeys.keyJ[i] > y0 - 100) {
      screenNotesKeyJ.push(i);
    } else {break}
  }
  lastIndexes.screenNotesKeyJ = i;

  for(i = lastIndexes.screenNotesKeyK; i < objectOfArraysOfKeys.keyK.length; i++) {
    if(objectOfArraysOfKeys.keyK[i] < height + 100 && objectOfArraysOfKeys.keyK[i] > y0 - 100) {
      screenNotesKeyK.push(i);
    } else {break}
  }
  lastIndexes.screenNotesKeyK = i;

  
  //this part draw the notes
  for(k = 0; k < screenNotesKeyS.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[0].x0, objectOfArraysOfKeys.keyS[screenNotesKeyS[k]], tileWidth, tileHeight);
  }
  //console.log(k);

  for(k = 0; k < screenNotesKeyD.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[1].x0, objectOfArraysOfKeys.keyD[screenNotesKeyD[k]], tileWidth, tileHeight);
  } 


  for(k = 0; k < screenNotesKeyF.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[2].x0, objectOfArraysOfKeys.keyF[screenNotesKeyF[k]], tileWidth, tileHeight);
  }

  for(k = 0; k < screenNotesKeySpaceBar.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[3].x0, objectOfArraysOfKeys.keySpaceBar[screenNotesKeySpaceBar[k]], tileWidth, tileHeight);
  }

  for(k = 0; k < screenNotesKeyJ.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[4].x0, objectOfArraysOfKeys.keyJ[screenNotesKeyJ[k]], tileWidth, tileHeight);
  }

  for(k = 0; k < screenNotesKeyK.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[5].x0, objectOfArraysOfKeys.keyK[screenNotesKeyK[k]], tileWidth, tileHeight);
  }
  



  //create the array of expecting notes the player should play (by saving the index of the objectOfArraysOfKeys.keyS)
  for(i = lastIndexes.expectingNotesKeyS; i < objectOfArraysOfKeys.keyS.length; i++) {
    if(objectOfArraysOfKeys.keyS[i] >= (y0Key - ranges.good)) {
      expectingS.push(i);
      console.log("Estive aqui no expectingS.push(i). ExpectingS: ", expectingS, "i = ", i);
    } else {break}
  }
  lastIndexes.expectingNotesKeyS = i;

  for(i = lastIndexes.expectingNotesKeyD; i < objectOfArraysOfKeys.keyD.length; i++) {
    if(objectOfArraysOfKeys.keyD[i] >= (y0Key - ranges.good)) {
      expectingD.push(i);
    } else {break}
  }
  lastIndexes.expectingNotesKeyD = i;

  for(i = lastIndexes.expectingNotesKeyF; i < objectOfArraysOfKeys.keyF.length; i++) {
    if(objectOfArraysOfKeys.keyF[i] >= (y0Key - ranges.good)) {
      expectingF.push(i);
    } else {break}
  }
  lastIndexes.expectingNotesKeyF = i;

  for(i = lastIndexes.expectingNotesKeySpaceBar; i < objectOfArraysOfKeys.keySpaceBar.length; i++) {
    if(objectOfArraysOfKeys.keySpaceBar[i] >= (y0Key - ranges.good)) {
      expectingSpaceBar.push(i);
    } else {break}
  }
  lastIndexes.expectingNotesKeySpaceBar = i;

  for(i = lastIndexes.expectingNotesKeyJ; i < objectOfArraysOfKeys.keyJ.length; i++) {
    if(objectOfArraysOfKeys.keyJ[i] >= (y0Key - ranges.good)) {
      expectingJ.push(i);
    } else {break}
  }
  lastIndexes.expectingNotesKeyJ = i;

  for(i = lastIndexes.expectingNotesKeyK; i < objectOfArraysOfKeys.keyK.length; i++) {
    if(objectOfArraysOfKeys.keyK[i] >= (y0Key - ranges.good)) {
      expectingK.push(i);
    } else {break}
  }
  lastIndexes.expectingNotesKeyK = i;




  //this part verifies if a expecting note in the expected time was played
  if(objectOfArraysOfKeys.keyS[expectingS[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingS.shift();
  }

  if(objectOfArraysOfKeys.keyD[expectingD[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingD.shift();
  }

  if(objectOfArraysOfKeys.keyF[expectingF[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingF.shift();
  }

  if(objectOfArraysOfKeys.keySpaceBar[expectingSpaceBar[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingSpaceBar.shift();
  }

  if(objectOfArraysOfKeys.keyJ[expectingJ[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingJ.shift();
  }

  if(objectOfArraysOfKeys.keyK[expectingK[0]] > (y0Key + ranges.good + tileHeight)) {
    miss++;
    //document.getElementById("miss").textContent = `Miss: ${miss}`;
    expectingK.shift();
  }


  for(k = 0; k < screenNotesKeyS.length; k++) {
    ctx.fillStyle = tileColor;
    ctx.fillRect(keysArray[0].x0, objectOfArraysOfKeys.keyS[screenNotesKeyS[k]], tileWidth, tileHeight);
  }


  document.getElementById("miss").textContent = `Miss: ${miss}`;
  
  return lastIndexes;

}


let lastIndexes = {
  expectingNotesKeyS: 0,
  expectingNotesKeyD: 0,
  expectingNotesKeyF: 0,
  expectingNotesKeySpaceBar: 0,
  expectingNotesKeyJ: 0,
  expectingNotesKeyK: 0,
  screenNotesKeyS: 0,
  screenNotesKeyD: 0,
  screenNotesKeyF: 0,
  screenNotesKeySpaceBar: 0,
  screenNotesKeyJ: 0,
  screenNotesKeyK: 0
}


let tileColor = "rgb(170, 170, 170)";
//último ctrl + z
function draw1() {  
  // musicSpeed = 3 + 1*speedFactor; //bug do JS? se não colocar o 1 atrás não funciona!

  ctx.beginPath();

  //console.log("Estive aqui");

  //teste();

  //clearing the moving trace
  ctx.clearRect(0, 0, width, height);


  //repainting background
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(x0, y0, 915, 915);

  drawTilesAndKeys(keysArray);
  //teste();
  lastIndexes = getArrayOfNotesAndDraw(music1TilesY, y, lastIndexes, tileColor, keysArray, tileWidth, tileHeight);

  //tile color
  ctx.fillStyle = "rgb(170, 170, 170)";
  ctx.fill();
  ctx.closePath();

  //tile (music) velocity
  y = y + musicSpeed; 
  
}




let isButtonMusic1Clicked = false;
let interval1; //interval for music1

//clearInterval(interval1);

function music1Button() { 
  if(isButtonMusic1Clicked) {
    setTimeout(clearInterval, 15, interval1);
    y = 1000 + 43*sm+51*sm; //make the music "pass"
    isButtonMusic1Clicked = false;
    document.getElementById("music1").textContent = "Start music 1";
    enableButtons();

    setTimeout(function () {miss = 0}, 20);
    miss = 0;
    good = 0;
    perfect = 0;
    document.getElementById("perfect").textContent = `Perfect: ${perfect}`;
    document.getElementById("good").textContent = `Good: ${good}`;
    setTimeout(function () {document.getElementById("miss").textContent = `Miss: ${miss}`}, 22);

  } else {
    
    
    y = 0; //restart the music
    interval1 = setInterval(draw1, 7);
    isButtonMusic1Clicked = true;   

    document.getElementById("music1").textContent = "Stop music 1";
    miss = 0;
    good = 0;
    perfect = 0;

    document.getElementById("perfect").textContent = `Perfect: ${perfect}`;
    document.getElementById("good").textContent = `Good: ${good}`;
    document.getElementById("miss").textContent = `Miss: ${miss}`;
    
    
    lastIndexes = {
      expectingNotesKeyS: 0,
      expectingNotesKeyD: 0,
      expectingNotesKeyF: 0,
      expectingNotesKeySpaceBar: 0,
      expectingNotesKeyJ: 0,
      expectingNotesKeyK: 0,
      screenNotesKeyS: 0,
      screenNotesKeyD: 0,
      screenNotesKeyF: 0,
      screenNotesKeySpaceBar: 0,
      screenNotesKeyJ: 0,
      screenNotesKeyK: 0
    }

    expectingS = [];
    expectingD = [];
    expectingF = [];
    expectingSpaceBar = [];
    expectingJ = [];
    expectingK = [];

    ranges = getDifficulty();
    console.log(`range P: ${ranges.perfect}\nrange G: ${ranges.good}`);

    disableButtons();   
  }

}


//a=new AudioContext(); // browsers limit the number of concurrent audio contexts, so you better re-use'em

//v = a.createOscillator();

//function which plays the sound, oscillating
function beep(vol, freq, duration) {
  a=new AudioContext(); // browsers limit the number of concurrent audio contexts, so you better re-use'em

  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

//beep(100,600,200);

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }


  switch (event.key) {

    case "s": 
      //console.log(setTimeout(() => {console.log(":|")}, 3000));
      //if((event.timeStamp-timeStart) < firstHalfEnd) { //version 1.0, same to the other if inside cases
      if(y < firstHalfEnd2) { //version 2.0
        //beep(10, 261.6, 200);
        let sourceS = createAndLoadAudioFile("C4");
        sourceS.start();
      } else {beep(10, 2*261.6, 200);}
      //console.log(event);
      //console.log(event.timeStamp)
      
      if(expectingS.length > 0){
        expectingS.shift();
      }

      let isPerfectOrGoodKeyS = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeyS, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeyS = true;
            break;
          }
          good++;
          isPerfectOrGoodKeyS = true;
          break;
        }
      }
        /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeyS) {
          miss++;
        }
      isPerfectOrGoodKeyS = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      //só peguei o timeStart, preciso fazer o tempo transcorrido
      break;
      
    case "d": 
      if(y < firstHalfEnd2) {
        //beep(10, 293.66, 200);
        let sourceD = createAndLoadAudioFile("D4");
        sourceD.start();
      } else {beep(10, 2*293.66, 200)}

      if(expectingD.length > 0){
        expectingD.shift();
      }

      let isPerfectOrGoodKeyD = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeyD, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeyD = true;
            break;
          }
          good++;
          isPerfectOrGoodKeyD = true;
          break;
        }
      }
        /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeyD) {
          miss++;
        }
      isPerfectOrGoodKeyD = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "f": 
      if(y < firstHalfEnd2) {
        //beep(10, 349.23, 200);
        let sourceF = createAndLoadAudioFile("F4");
        sourceF.start();
      } else {beep(10, 2*349.23, 200)}

      if(expectingF.length > 0){
        expectingF.shift();
      }

      let isPerfectOrGoodKeyF = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeyF, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeyF = true;
            break;
          }
          good++;
          isPerfectOrGoodKeyF = true;
          break;
        }
      }
        /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeyF) {
          miss++;
        }
      isPerfectOrGoodKeyF = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case " ": 
      if(y < firstHalfEnd2) {
        //beep(10, 392, 200);
        let sourceSpaceBar = createAndLoadAudioFile("G4");
        sourceSpaceBar.start();
      } else {beep(10, 2*392, 200)}

      if(expectingSpaceBar.length > 0){
        expectingSpaceBar.shift();
      }

      let isPerfectOrGoodKeySpace = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeySpaceBar, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeySpace = true;
            break;
          }
          good++;
          isPerfectOrGoodKeySpace = true;
          break;
        }
      }
      /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeySpace) {
          miss++;
        }
      isPerfectOrGoodKeySpace = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "j": 
      if(y < firstHalfEnd2) {
        //beep(10, 440, 200);
        let sourceJ = createAndLoadAudioFile("A4");
        sourceJ.start();
      } else {beep(10, 2*440, 200)}

      if(expectingJ.length > 0){
        expectingJ.shift();
      }

      let isPerfectOrGoodKeyJ = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeyJ, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeyJ = true;
            break;
          }
          good++;
          isPerfectOrGoodKeyJ = true;
          break;
        }
      }
      /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeyJ) {
          miss++;
        }
      isPerfectOrGoodKeyJ = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "k": 
      if(y < firstHalfEnd2) {
        //beep(10, 523.25, 200);
        let sourceK = createAndLoadAudioFile("C5");
        sourceK.start();
      } else {beep(10, 2*523.25, 200)}

      if(expectingK.length > 0){
        expectingK.shift();
      }

      let isPerfectOrGoodKeyK = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0KeyK, k, 1, 1).data[0] == 170) {
          if(k >= y0 + 850 - ranges.perfect && k<= y0 + 865 + ranges.perfect) {
            perfect++;
            isPerfectOrGoodKeyK = true;
            break;
          }
          good++;
          isPerfectOrGoodKeyK = true;
          break;
        }
      }
      /* //this miss attribution may not be good, I am testing without it:
        if(!isPerfectOrGoodKeyK) {
          miss++;
        }
      isPerfectOrGoodKeyK = false;
      */

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "l": 
      //pianoNote.play();
      //pianoA4.play();
      let sourceL = createAndLoadAudioFile("C6");
        sourceL.start();
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      pianoA4.play();
      console.log("played pianoA4")
      // Do something for "enter" or "return" key press.
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    case "q":
      console.log("speedFactor: ", speedFactor); //debuggin purposes
      //createAndLoad7AudioFiles("C2", "C3", "C4", "E4", "G4", "Bb4", "C5");
      source.sourceS.start();
        break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  document.getElementById("perfect").textContent = `Perfect: ${perfect}`;
  document.getElementById("good").textContent = `Good: ${good}`;
  document.getElementById("miss").textContent = `Miss: ${miss}`;

  console.log("ranges.good: ", ranges.good + " " + "ranges.perfect: ", ranges.perfect);

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);


/*
window.addEventListener("keyup", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }


  switch (event.key) {

    case "s": 
      source.sourceS.stop();
      //gainNodeS.gain.value = 0.4; // channel 1 volume
      break;
      
    case "d": 
      source.sourceD.stop();
      break;

    case "f": 
      source.sourceF.stop();
      break;

    case " ": 
      source.sourceSpaceBar.stop();
      break;

    case "j": 
      source.sourceJ.stop();
      break;
        
    case "k": 
      source.sourceK.stop();
      break;

    case "l": 
      source.sourceL.stop();  
      break;

    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

*/

console.log(ctx.getImageData(315, 850, 1, 1).data);


console.log("projectO2 carregado com sucesso");

//coisas que melhorariam esse programa:

  //criar testes! (pedir ajuda do chatGPT, para ter exemplos, por exemplo)
 
  //melhorar a function music1Button() na parte do clear interval. Executar o resto depois que isso ocorrer. Assim, não precisarei dos outros timeouts
  //posicionar melhor os document.getElementById("miss").textContent = `Miss: ${miss}`;, principalmente dentro da função getArrayOfNotesAndDraw

  //? Já que tem que dar load a cada vez que toca (não pode dar start() mais que uma vez), fazer uma função só ?
    

  // ----> REFATORAR O CÓDIGO:
  // --> reference: https://levelup.gitconnected.com/javascript-best-practices-for-writing-more-robust-code-clean-code-f1730db3441d

    //criar função para atualizar/resetar valores das variáveis
    //redefinir o nome de algumas coisas e/ou criar nome para o que não tem
    //comentar o que cada parte do código faz, do início ao fim
    //criar funções
    //criar classes e objetos
    //analisar se o código está dentro dos paradigmas

  // Next step -> estudar MIDI e testar (api, library)
    

  //estudar MIDI file e importar midi file para gerar uma música!
    //https://www.youtube.com/watch?v=Z3e8q1NLNmo&ab_channel=EdD
    //https://people.carleton.edu/~jellinge/m208w14/pdf/02MIDIBasics_doc.pdf
  //soar a nota enquanto a tecla é apertada (e não por tempo)
  //fazer multiplayer
  //gravar highscore e só resetar se apertar no botão reset
  
    //fazer um sistema de miss
      //mais fácil: completar com miss no final o que faltou de notas (total de notas - good - perfect = miss), se o cara só tem 3 miss e deveria ser 30, completar
      //mais top: dar miss se era pra ter apertado a tecla e não apertou
  //pegar uma segunda música, de videogame (dueto, de preferência)
  //fazer o user poder trocar o timbre do oscillator
  //fazer uma música com timbre de piano real, e uma tecla tocar um acorde (mais que uma nota)
    //talvez fazer também que uma tecla toca um pequeno trechinho
  //fazer um pwa (reconhecer quando é um smartphone e reconhecer toques na tela invés de teclas)
  //fazer um efeito ao lado das teclas para indicar que foram apertadas e que houve perfect, good ou miss
  //mostrar o SDF SpaceBar JKL em algum lugar
  //fazer
    //um array (ou object array) para todas as notas da música
    //um buffer (que carrega toda a música)
    //um screen (que armazena o que está na tela)
    //função drawMusicTiles: buffer recebe o array da música e screen carrega o que está no buffer conforme vai saindo da tela
      //Imprime screen 
    //vantagem: evita fazer os fillRect para tiles que nem estão na tela (não chegaram ou já passaram) 

    //bugs
       //miss ficou mais bugado desde a implementação da feature que atribui miss a uma nota não apertada
        //POSSÍVEL SOLUÇÃO: deixar de contabilizar o miss fora dessa situação. Se apertar quando não deve, não considerar um miss.
      //parece haver um delay para a verificação de perfect, good, miss. É como se o range se deslocasse para cima. Verificar isso.
        //ver conversa com Igor sobre isso
      //música quando tocada muito rápida apresenta bugs no score
      //calibrar melhor as dificuldades (facilitar todas)
      //por que se aperta as teclas muito rápido muitas vezes para de soar? mudar o método de tocar som



    
    
//coisas feitas
  //fazer um botão para a música começar
  //usar o timestamp! (fazer na musica atual pra tocar uma oitava acima tudo de novo)
  //pesquisar melhor quando começa a contar o timestamp, dependendo do momento criar um contador de tempo após apertar esse botão
  //começar a contar um cronometro quando a música começa (quando os tiles começam a cair) e reatribuir sons às teclas
  //fazer um sistema de pontos: perfect, good e miss
  //ajuste de velocidade da música pelo user
  //não precisei mais trocar timeStamp para date.now (estou usando os pixels percorridos)
  //fazer ajuste de dificuldade (mudando o range, tipo o que fiz com a velocidade)
    //corrigir o sistema de dificuldades:
    //o range e o ranges.perfect estão mal feitos, quanto maior um mais dificil, mas com o outro é o contrário
    //mudar isso e mudar como eu atribuo e reatribuo esses valores
    //mudar os values no HTML

  //tirar o lixo do código (codigos comentados, guardar somente de backup num novo arquivo OLD, deixar esse aqui como o original)
  //tirar o lixo do código (códigos que não são úteis)

  //fazer uma função createAndLoadAudioFile(note) que retorna um source para dar start()




  
//Novidades deste commit:
  //Add a miss counter if no key is pressed when supposed to (and now it is the only way to miss). Change createAndLoad7AudioFiles(7notes) to createAndLoadAudioFile(note).
  











/*
//Code used to clean up

function getYPart(str) {
  let indexOfAsterisk;
  let i = 0;
  let stringY = "";
  while(str.indexOf("51*sm", i) != -1) {
    indexOfAsterisk = str.indexOf("51*sm", i);
    let j = indexOfAsterisk;
    while (str[j-1] != "y") {
      j--;
    }
    stringY += (str.substring(j-1, indexOfAsterisk + 5)) + ", " ;
    i = indexOfAsterisk + 1;
  }
  console.log("Get y part: ", stringY)
}

str1 = `    ctx.rect(x0KeyS, y-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyS, y-10*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyS, y-12*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyS, y-30*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyS, y-34*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyS, y-36*sm-51*sm, tileWidth, tileHeight);`
str2 = `
ctx.rect(x0KeyD, y-9*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyD, y-31*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyD, y-33.5*sm-51*sm, tileWidth, tileHeight);
`
str3 = `
ctx.rect(x0KeyF, y-1*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-3.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-7*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-13*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-15.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-28*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-32.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-33*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-37*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-39.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyF, y-43*sm-51*sm, tileWidth, tileHeight);
`
str4 = `
ctx.rect(x0KeySpaceBar, y-6*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeySpaceBar, y-18*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeySpaceBar, y-42*sm-51*sm, tileWidth, tileHeight);
`
str5 = `
ctx.rect(x0KeyJ, y-3*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-4*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-15*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-16*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-24*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-26.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-27.5*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-39*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyJ, y-40*sm-51*sm, tileWidth, tileHeight);
`
str6 = `
ctx.rect(x0KeyK, y-19*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyK, y-25*sm-51*sm, tileWidth, tileHeight);
ctx.rect(x0KeyK, y-27*sm-51*sm, tileWidth, tileHeight);
`

console.log("KeyS: ");
getYPart(str1);
str1 = [y-51*sm, y-10*sm-51*sm, y-12*sm-51*sm, y-30*sm-51*sm, y-34*sm-51*sm, y-36*sm-51*sm]
console.log("qtd notas: ", str1.length)
console.log("KeyD: ");
getYPart(str2);
str2 = [y-9*sm-51*sm, y-31*sm-51*sm, y-33.5*sm-51*sm]
console.log("qtd notas: ", str2.length)
console.log("KeyF: ");
getYPart(str3);
str3 = [y-1*sm-51*sm, y-3.5*sm-51*sm, y-7*sm-51*sm, y-13*sm-51*sm, y-15.5*sm-51*sm, y-28*sm-51*sm, y-32.5*sm-51*sm, y-33*sm-51*sm, y-37*sm-51*sm, y-39.5*sm-51*sm, y-43*sm-51*sm]
console.log("qtd notas: ", str3.length)
console.log("KeySpaceBar: ");
getYPart(str4);
str4 = [y-6*sm-51*sm, y-18*sm-51*sm, y-42*sm-51*sm]
console.log("qtd notas: ", str4.length)
console.log("KeyJ: ");
getYPart(str5);
str5 = [y-3*sm-51*sm, y-4*sm-51*sm, y-15*sm-51*sm, y-16*sm-51*sm, y-24*sm-51*sm, y-26.5*sm-51*sm, y-27.5*sm-51*sm, y-39*sm-51*sm, y-40*sm-51*sm]
console.log("qtd notas: ", str5.length)
console.log("KeyK: ");
getYPart(str6);
str6 = [y-19*sm-51*sm, y-25*sm-51*sm, y-27*sm-51*sm]
console.log("qtd notas: ", str6.length)

*/





/* 
//backup function
function draw7Keys() {
  //7 keys inicialization
  ctx.fillStyle = "rgb(255, 0, 0)";

  let gapKeysX0 = 100; //distance between x0 (start horizontal point) of the neighbor keys
  let x0KeyS = x0 + 115;
  let x0KeyD = x0KeyS + gapKeysX0;
  let x0KeyF = x0KeyD + gapKeysX0;
  let x0KeySpaceBar = x0KeyF + gapKeysX0;
  let x0KeyJ = x0KeySpaceBar + gapKeysX0;
  let x0KeyK = x0KeyJ + gapKeysX0;
  let x0KeyL = x0KeyK + gapKeysX0;

  //red keys
  ctx.fillRect(x0KeyS, y0Key, keyWidth, keyHeight);
  ctx.fillRect(x0KeyD, y0Key, keyWidth, keyHeight);
  ctx.fillRect(x0KeyF, y0Key, keyWidth, keyHeight);

  ctx.fillRect(x0KeyJ, y0Key, keyWidth, keyHeight);
  ctx.fillRect(x0KeyK, y0Key, keyWidth, keyHeight);
  ctx.fillRect(x0KeyL, y0Key, keyWidth, keyHeight);

  //blue key
  ctx.fillStyle = "rgb(0, 0, 255)"
  ctx.fillRect(x0KeySpaceBar, y0Key, keyWidth, keyHeight);
}
*/
//draw7Keys();


/*




function teste() {
  ctx.rect(x0+115, y, tileWidth, tileHeight);
  ctx.rect(x0+115, y-10*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-12*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-30*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-34*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-36*sm, tileWidth, tileHeight);
  //D (note D4)
  ctx.rect(x0+115+100, y-9*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+100, y-31*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+100, y-33.5*sm, tileWidth, tileHeight);
  //F (note F4)
  ctx.rect(x0+115+2*100, y-1*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-3.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-7*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-13*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-15.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-28*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-32.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-33*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-37*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-39.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-43*sm, tileWidth, tileHeight);
  //space (note G4)
  ctx.rect(x0+115+3*100, y-6*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+3*100, y-18*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+3*100, y-42*sm, tileWidth, tileHeight);
  //J (note A4)
  ctx.rect(x0+115+4*100, y-3*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-4*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-15*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-16*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-24*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-26.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-27.5*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-39*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-40*sm, tileWidth, tileHeight);
  //K (note C5)
  ctx.rect(x0+115+5*100, y-19*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+5*100, y-25*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+5*100, y-27*sm, tileWidth, tileHeight);

  //copiando a música inteira para fazer uma oitava acima
  //S (note C5)
  ctx.rect(x0+115, y-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-10*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-12*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-30*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-34*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115, y-36*sm-51*sm, tileWidth, tileHeight);
  //D (note D5)
  ctx.rect(x0+115+100, y-9*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+100, y-31*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+100, y-33.5*sm-51*sm, tileWidth, tileHeight);
  //F (note F5)
  ctx.rect(x0+115+2*100, y-1*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-3.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-7*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-13*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-15.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-28*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-32.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-33*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-37*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-39.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+2*100, y-43*sm-51*sm, tileWidth, tileHeight);
  //space (note G5)
  ctx.rect(x0+115+3*100, y-6*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+3*100, y-18*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+3*100, y-42*sm-51*sm, tileWidth, tileHeight);
  //J (note A5)
  ctx.rect(x0+115+4*100, y-3*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-4*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-15*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-16*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-24*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-26.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-27.5*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-39*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+4*100, y-40*sm-51*sm, tileWidth, tileHeight);
  //K (note C6)
  ctx.rect(x0+115+5*100, y-19*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+5*100, y-25*sm-51*sm, tileWidth, tileHeight);
  ctx.rect(x0+115+5*100, y-27*sm-51*sm, tileWidth, tileHeight);
}

*/