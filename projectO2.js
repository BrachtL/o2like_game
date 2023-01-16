/*


*/

//background game inicialization
let backgroundGame = document.querySelector(".backgroundGame");
let x0 = 200;
let y0 = 0;
let width = backgroundGame.width = 915 + x0;
//let width = canvas.width = window.innerWidth;
let height = backgroundGame.height = 915 + y0;
//let height = canvas.height = window.innerHeight;
let ctx = backgroundGame.getContext("2d");

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(x0, 0, 915, 915);

//7 keys inicialization
ctx.fillStyle = "rgb(255, 0, 0)";
//ctx.fillRect(x0+100, y0+720, x0+100+70, y0+720+30);
ctx.fillRect(x0+115, y0+850, 70, 15);
ctx.fillRect(x0+115+100, y0+850, 70, 15);
ctx.fillRect(x0+115+2*100, y0+850, 70, 15);

ctx.fillRect(x0+115+4*100, y0+850, 70, 15);
ctx.fillRect(x0+115+5*100, y0+850, 70, 15);
ctx.fillRect(x0+115+6*100, y0+850, 70, 15);

ctx.fillStyle = "rgb(0, 0, 255)"
ctx.fillRect(x0+115+3*100, y0+850, 70, 15);

/*ctx.fillStyle = "rgba(255, 0, 255, 0.75)";
ctx.fillRect(225, 100, 175, 50);*/

//ctx.lineWidth = 5;
//ctx.fill();

/*
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
*/

//ctx.strokeStyle = "rgb(255, 0, 255)";
//ctx.strokeRect(25, 25, 175, 200);
//ctx.translate(width / 2, height / 2);

//window.requestAnimationFrame(/*function with a recall of requestAnimationFrame*/);
//window.cancelAnimationFrame(/*call it when the animation should stop*/)

/*
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

loop();*/

//let tiles = document.querySelector(".tiles");
//let x0 = 300;
//let y0 = 30;
//let width = canvas.width = window.innerWidth;
//let height = canvas.height = window.innerHeight;
//ctx = tiles.getContext("2d");

let y = 0; //musicTracer (y axis position)
let sm = 256; //seminima

let speedInput = document.getElementById("speed");
let speedFactor = 0; // -2.0 to +2.0, step: 0.4 (HTML)
let musicSpeed;
musicSpeed = 4 + speedFactor;
//let firstHalfEnd = 1.14586 * 7 * 12812 / musicSpeed;
let firstHalfEnd2 = 12812; //12812 is the half music "length" in pixels, will value zero when it is done
  //850 - 70 + 256*47
  //850 - 70 -> distance between top of the canvas and the key height
  //256 -> sm
  // 47 -> last note of the first half is 43 and first note of the second half is 51, 47 is the middle

//let musicTracker = 0; //o y é o musicTracker LOL

speedInput.addEventListener('input', function() {
  //if(speedInput.length < 3) {
    speedFactor = this.value;
    musicSpeed = 4 + 1*speedFactor;
  //}
});



//backgroundGame = document.getElementById('.backgroundGame');
//ctx = backgroundGame.getContext('2d');


let timeStart = 0;
let timeTest = false;
//let firstHalfEnd = 33000 - speedFactor*; //mark to up an octave in first song, change the notes

let timeStamp;
let range = 15; //range to consider good or miss
let rangeP = 0; //range to consider perfect: max value = 7, negative number are possible, min value = -(range+1)
let perfect = 0, good = 0, miss = 0;

function draw1() {  
  //musicTracker += musicSpeed; // o y é o musicTracker LOL
  // musicSpeed = 3 + 1*speedFactor; //bug do JS? se não colocar o 1 atrás não funciona!

  ctx.beginPath();
  //S (note C4)
  ctx.rect(x0+115, y, 70, 15);
  ctx.rect(x0+115, y-10*sm, 70, 15);
  ctx.rect(x0+115, y-12*sm, 70, 15);
  ctx.rect(x0+115, y-30*sm, 70, 15);
  ctx.rect(x0+115, y-34*sm, 70, 15);
  ctx.rect(x0+115, y-36*sm, 70, 15);
  //D (note D4)
  ctx.rect(x0+115+100, y-9*sm, 70, 15);
  ctx.rect(x0+115+100, y-31*sm, 70, 15);
  ctx.rect(x0+115+100, y-33.5*sm, 70, 15);
  //F (note F4)
  ctx.rect(x0+115+2*100, y-1*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-3.5*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-7*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-13*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-15.5*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-28*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-32.5*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-33*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-37*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-39.5*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-43*sm, 70, 15);
  //space (note G4)
  ctx.rect(x0+115+3*100, y-6*sm, 70, 15);
  ctx.rect(x0+115+3*100, y-18*sm, 70, 15);
  ctx.rect(x0+115+3*100, y-42*sm, 70, 15);
  //J (note A4)
  ctx.rect(x0+115+4*100, y-3*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-4*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-15*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-16*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-24*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-26.5*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-27.5*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-39*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-40*sm, 70, 15);
  //K (note C5)
  ctx.rect(x0+115+5*100, y-19*sm, 70, 15);
  ctx.rect(x0+115+5*100, y-25*sm, 70, 15);
  ctx.rect(x0+115+5*100, y-27*sm, 70, 15);

  //copiando a música inteira para fazer uma oitava acima
  //S (note C5)
  ctx.rect(x0+115, y-51*sm, 70, 15);
  ctx.rect(x0+115, y-10*sm-51*sm, 70, 15);
  ctx.rect(x0+115, y-12*sm-51*sm, 70, 15);
  ctx.rect(x0+115, y-30*sm-51*sm, 70, 15);
  ctx.rect(x0+115, y-34*sm-51*sm, 70, 15);
  ctx.rect(x0+115, y-36*sm-51*sm, 70, 15);
  //D (note D5)
  ctx.rect(x0+115+100, y-9*sm-51*sm, 70, 15);
  ctx.rect(x0+115+100, y-31*sm-51*sm, 70, 15);
  ctx.rect(x0+115+100, y-33.5*sm-51*sm, 70, 15);
  //F (note F5)
  ctx.rect(x0+115+2*100, y-1*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-3.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-7*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-13*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-15.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-28*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-32.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-33*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-37*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-39.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+2*100, y-43*sm-51*sm, 70, 15);
  //space (note G5)
  ctx.rect(x0+115+3*100, y-6*sm-51*sm, 70, 15);
  ctx.rect(x0+115+3*100, y-18*sm-51*sm, 70, 15);
  ctx.rect(x0+115+3*100, y-42*sm-51*sm, 70, 15);
  //J (note A5)
  ctx.rect(x0+115+4*100, y-3*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-4*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-15*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-16*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-24*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-26.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-27.5*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-39*sm-51*sm, 70, 15);
  ctx.rect(x0+115+4*100, y-40*sm-51*sm, 70, 15);
  //K (note C6)
  ctx.rect(x0+115+5*100, y-19*sm-51*sm, 70, 15);
  ctx.rect(x0+115+5*100, y-25*sm-51*sm, 70, 15);
  ctx.rect(x0+115+5*100, y-27*sm-51*sm, 70, 15);



  //clearing the moving trace
  ctx.clearRect(0, 0, width, height);

  //repainting the static things (background and 7 keys)
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(x0, y0, 915, 915);
  ctx.fillStyle = "rgb(255, 0, 0)";
  //ctx.fillRect(x0+100, y0+720, x0+100+70, y0+720+30);
  ctx.fillRect(x0+115, y0+850, 70, 15);
  ctx.fillRect(x0+115+100, y0+850, 70, 15);
  ctx.fillRect(x0+115+2*100, y0+850, 70, 15);

  ctx.fillRect(x0+115+4*100, y0+850, 70, 15);
  ctx.fillRect(x0+115+5*100, y0+850, 70, 15);
  ctx.fillRect(x0+115+6*100, y0+850, 70, 15);

  ctx.fillStyle = "rgb(0, 0, 255)"
  ctx.fillRect(x0+115+3*100, y0+850, 70, 15);
  //ctx.fillRect(x0, 0, 100, 100);

  //tile color
  ctx.fillStyle = "rgb(170, 170, 170)";
  ctx.fill();
  ctx.closePath();

  //tile (music) velocity
  y = y + musicSpeed; 
  
}


//draw1(); 
//setInterval(draw1, 3);
let isButton1Clicked = false;
let interval1;

clearInterval(interval1);

function music1Button() { 
  if(isButton1Clicked) {
    setTimeout(clearInterval, 15, interval1);
    y = 1000 + 43*sm+51*sm; //make the music "pass"
    isButton1Clicked = false;
    document.getElementById("music1").textContent = "Start music 1";
  } else {
    timeStart = window.event.timeStamp; //timeStamp is been used to know when reatribute the notes
    console.log(window.event.timeStamp);
    
    y = 0; //restart the music
    interval1 = setInterval(draw1, 7);
    isButton1Clicked = true;   

    document.getElementById("music1").textContent = "Stop music 1";
    miss = good = perfect = 0;
    
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


/*
const audioCtx = new AudioContext();

// create Oscillator node
const oscillator = audioCtx.createOscillator();

oscillator.type = "square";
oscillator.frequency.setValueAtTime(3000, audioCtx.currentTime); // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();
*/

/*
let button = document.querySelector("#music1");
button.addEventListener('mouseup', (e) => {
  let log = document.querySelector('#log');
  switch (e.button) {
    case 0:
      beep(50,300,200);
      break;
    case 1:
      log.textContent = 'Middle button clicked.';
      break;
    case 2:
      log.textContent = 'Right button clicked.';
      break;
    default:
      log.textContent = `Unknown button code: ${e.button}`;
  }
});
*/


window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  //verify if it is time to reattribute the notes, version 2.0
  if((y > firstHalfEnd2) && !timeTest) {
    timeTest = true;
  }

  /*
  //verify if it is time to reattribute the notes
  if((event.timeStamp - timeStart) > firstHalfEnd && !timeTest) {
  }
  */

  switch (event.key) {
    
    case "s": 
      //console.log(setTimeout(() => {console.log(":|")}, 3000));
      //if((event.timeStamp-timeStart) < firstHalfEnd) { //version 1.0, same to the other if inside cases
      if(y < firstHalfEnd2) { //version 2.0
        beep(10, 261.6, 200);
      } else {beep(10, 2*261.6, 200);}
      //console.log(event);
      //console.log(event.timeStamp)
      if(ctx.getImageData(x0+115, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);
      
      //só peguei o timeStart, preciso fazer o tempo transcorrido
      break;
    case "d": 
      if(y < firstHalfEnd2) {
        beep(10, 293.66, 200);
      } else {beep(10, 2*293.66, 200)}

      if(ctx.getImageData(x0+115+100, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115+100, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);

        break;
    case "f": 
      if(y < firstHalfEnd2) {
        beep(10, 349.23, 200);
      } else {beep(10, 2*349.23, 200)}

      if(ctx.getImageData(x0+115+100*2, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*2, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115+100*2, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*2, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);


        break;
    case " ": 
      if(y < firstHalfEnd2) {
        beep(10, 392, 200);
      } else {beep(10, 2*392, 200)}

      if(ctx.getImageData(x0+115+100*3, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*3, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115+100*3, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*3, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);


        break;
    case "j": 
      if(y < firstHalfEnd2) {
        beep(10, 440, 200);
      } else {beep(10, 2*440, 200)}

      if(ctx.getImageData(x0+115+100*4, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*4, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115+100*4, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*4, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
      console.log(`perfect: ${perfect} \ngood: ${good} \nmiss: ${miss}`);


        break;
    case "k": 
      if(y < firstHalfEnd2) {
        beep(10, 523.25, 200);
      } else {beep(10, 2*523.25, 200)}

      if(ctx.getImageData(x0+115+100*5, y0+850+rangeP, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*5, y0+865-rangeP, 1, 1).data[0] == 170) {
        perfect++;
      } else if(ctx.getImageData(x0+115+100*5, y0+850-range, 1, 1).data[0] == 170 || ctx.getImageData(x0+115+100*5, y0+865+range, 1, 1).data[0] == 170) {
        good++;
      } else {miss++}
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
      console.log(speedFactor);
        break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

console.log(ctx.getImageData(315, 850, 1, 1).data);







console.log("projectO2 carregado com sucesso");

//coisas que melhorariam esse programa:
  //soar a nota enquanto a tecla é apertada (e não por tempo)
  //fazer multiplayer
  //trocar timeStamp para date.now (acho que nao preciso mais disso, agora estou usado os pixels percorridos)
  //gravar highscore e só resetar se apertar no botão reset
  //criar um novo arquivo, sem as coisas olds desse (tipo o firstHalfEnd e demais coisas comentadas)
    //limpar esse novo código atribuindo variáveis (nomes) aos números (tipo o que fiz com a seminima)
    //assim eu limpo o código, mas não perco coisas já feitas de outro jeito se quiser consultar
  //passar código do console.log para a barra lateral esquerda
    //completar com miss no final o que faltou de notas (total de notas - good - perfect = miss), se o cara só tem 3 miss e deveria ser 30, completar
  //pegar uma segunda música, de videogame (dueto, de preferência)
  //fazer o user poder trocar o timbre do oscillator
  //fazer uma música com timbre de piano real, e uma tecla tocar um acorde (mais que uma nota)
    //talver fazer também que uma tecla toca um pequeno trechinho
  //fazer ajuste de dificuldade (mudando o range, tipo o que fiz com a velocidade)
    
    
//coisas feitas
  //fazer um botão para a música começar
  //usar o timestamp! (fazer na musica atual pra tocar uma oitava acima tudo de novo)
  //pesquisar melhor quando começa a contar o timestamp, dependendo do momento criar um contador de tempo após apertar esse botão
  //começar a contar um cronometro quando a música começa (quando os tiles começam a cair) e reatribuir sons às teclas
  //fazer um sistema de pontos: perfect, good e miss
  //ajuste de velocidade da música pelo user