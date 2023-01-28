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


class Tile {
  constructor(color, x0Tile, y0Tile, tileWidth, tileHeight) {
    this.color = color,
    this.x0Tile = x0Tile,
    this.y0Tile = y0Tile,
    this.tileWidth = tileWidth,
    this.tileHeight = tileHeight
  }
}

//array of keys: SDF spacebar JKL
const keysArray = [
                    new Tile("rgb(255, 0, 0)", x0KeyS, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(255, 0, 0)", x0KeyD, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(255, 0, 0)", x0KeyF, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(0, 0, 255)", x0KeySpaceBar, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(255, 0, 0)", x0KeyJ, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(255, 0, 0)", x0KeyK, y0Key, keyWidth, keyHeight),
                    new Tile("rgb(255, 0, 0)", x0KeyL, y0Key, keyWidth, keyHeight)
                  ]


function drawTiles(tilesObjectArray) {
  for(i = 0; i < tilesObjectArray.length; i++) {
    ctx.fillStyle = tilesObjectArray[i].color;
    ctx.fillRect(tilesObjectArray[i].x0Tile, tilesObjectArray[i].y0Tile, tilesObjectArray[i].tileWidth, tilesObjectArray[i].tileHeight);
  }
}

drawTiles(keysArray);

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





function draw1() {  
  // musicSpeed = 3 + 1*speedFactor; //bug do JS? se não colocar o 1 atrás não funciona!

  ctx.beginPath();

  //S (note C4)
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


  //clearing the moving trace
  ctx.clearRect(0, 0, width, height);

  //repainting background
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(x0, y0, 915, 915);

  drawTiles(keysArray);

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
  } else {
    
    
    y = 0; //restart the music
    interval1 = setInterval(draw1, 7);
    isButtonMusic1Clicked = true;   

    document.getElementById("music1").textContent = "Stop music 1";
    miss = good = perfect = 0;
    
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
        beep(10, 261.6, 200);
      } else {beep(10, 2*261.6, 200);}
      //console.log(event);
      //console.log(event.timeStamp)
      
      let isPerfectOrGoodKeyS = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeyS) {
          miss++;
        }
      isPerfectOrGoodKeyS = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      //só peguei o timeStart, preciso fazer o tempo transcorrido
      break;
      
    case "d": 
      if(y < firstHalfEnd2) {
        beep(10, 293.66, 200);
      } else {beep(10, 2*293.66, 200)}

      let isPerfectOrGoodKeyD = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115+100, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeyD) {
          miss++;
        }
      isPerfectOrGoodKeyD = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "f": 
      if(y < firstHalfEnd2) {
        beep(10, 349.23, 200);
      } else {beep(10, 2*349.23, 200)}

      let isPerfectOrGoodKeyF = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115+200, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeyF) {
          miss++;
        }
      isPerfectOrGoodKeyF = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case " ": 
      if(y < firstHalfEnd2) {
        beep(10, 392, 200);
      } else {beep(10, 2*392, 200)}

      let isPerfectOrGoodKeySpace = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115+300, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeySpace) {
          miss++;
        }
      isPerfectOrGoodKeySpace = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "j": 
      if(y < firstHalfEnd2) {
        beep(10, 440, 200);
      } else {beep(10, 2*440, 200)}

      let isPerfectOrGoodKeyJ = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115+400, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeyJ) {
          miss++;
        }
      isPerfectOrGoodKeyJ = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "k": 
      if(y < firstHalfEnd2) {
        beep(10, 523.25, 200);
      } else {beep(10, 2*523.25, 200)}

      let isPerfectOrGoodKeyK = false;
      for(k=y0Key-ranges.good; k<=y0+865+ranges.good; k+=tileHeight-1) {
        if(ctx.getImageData(x0+115+500, k, 1, 1).data[0] == 170) {
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
        if(!isPerfectOrGoodKeyK) {
          miss++;
        }
      isPerfectOrGoodKeyK = false;

      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      break;

    case "l": 
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    case "q":
      console.log("speedFactor: ", speedFactor); //debuggin purposes
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

console.log(ctx.getImageData(315, 850, 1, 1).data);


console.log("projectO2 carregado com sucesso");

//coisas que melhorariam esse programa:
 

  // ----> REFATORAR O CÓDIGO:
  // --> reference: https://levelup.gitconnected.com/javascript-best-practices-for-writing-more-robust-code-clean-code-f1730db3441d

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

    //bugs
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




//Last commit:
  //replace some magical numbers for variables: x0Keys, y0Keys, width, height, keyWidth, keyHeight, tileWidth
  
//Novidades deste commit:
  //create class Tile, function drawTiles, and change some let to const, cleaning up the code
