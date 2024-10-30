let canva = document.getElementById("canva");
const ctx = canva.getContext("2d");
canva.height = window.innerHeight;
canva.width = window.innerWidth;

ctx.font = "50px Arial";

let bgCanva = document.getElementById("bgCanva");
const bgCtx = bgCanva.getContext("2d");
bgCanva.height = window.innerHeight;
bgCanva.width = window.innerWidth;

let height = 400;

let id = new URLSearchParams(window.location.search)
let params = atob(id.get("id")).split('|')

let points = 0
let shop = false;
if(localStorage.getItem("points")) {
  points = Number(localStorage.getItem("points"));
}

/////////////// ANIMATION PARAMS /////////////////
let minPos = 150;
let maxPos = 1470;

let srcX = 0;
let srcY = 0;

let rows = 0;
let colummns = 1;

let spriteWidth = 32 * 3;
let spriteHeight = 32 * 4 * 3;

let currentFrame = 0;
let totalFrames = 2;
let freeFrames = 0;
let animationFrame = 0;
let animationLoops = 0;

let state = Math.floor(Math.random() * 2);  

let nextPos = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos;

let allowTicking = true;
let allowMovement = true;
let allowStatic = false;
let iddle = false;
//////////////////////////////////////////////////////


const renderBG = () => {
  ctx.fillStyle = '#696a6a';
  ctx.fillRect(0, 0, canva.width, canva.height)
}

let positionX = (canva.width / 2 ) - 150;
let positionY = 300;

let listenerAdded = false;

const mainRender = () => {
  ctx.fillStyle = '#cac11c';
  ctx.fillRect(0, 0, canva.width * 0.125, canva.height)
  ctx.fillRect(canva.width - (canva.width * 0.125), 0, canva.width * 0.125, canva.height)

  function leftLateralBuilder(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); 
    ctx.lineTo(x + width, y); 
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); 
    ctx.quadraticCurveTo(x, y, x + radius, y); 
    ctx.closePath(); 
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  function rightLateralBuilder(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y); 
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height); 
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill(); 
  }

  rightLateralBuilder(ctx, canva.width - (canva.width * 0.125), 0, 150, canva.height, 50);
  leftLateralBuilder(ctx, (canva.width * 0.125) - 150, 0, 150, canva.height, 50);

  ctx.fillStyle = 'black';

  // Upper border
  ctx.fillRect(canva.width * 0.125, 0, canva.width - (canva.width * 0.125) * 2, 5)

  // Floor
  ctx.fillRect(canva.width * 0.125, canva.height - 150, canva.width - (canva.width * 0.125) * 2, 150)
}

function shopRender() {
  if(shop) {
    ctx.fillStyle = "#ce964e";
    ctx.fillRect((canva.width / 2) - canva.width / 2 + canva.width * 0.125, 5, canva.width - canva.width * 0.25, canva.height - 150)

    ctx.fillStyle = "pink"
    ctx.fillText("Tienda", canva.width * 0.125 + 50, 100);
  }
}

function renderItems() {
  
}

function buildButtons() {
  const actionButton = {
    x: (window.innerWidth / 2) - (350 / 2),
    y: canva.height - (150 / 2) - 75 / 2,
    width: 350,
    height: 75
  }
  
  const returnButton = {
    x: (canva.width * 0.125) + 75,
    y: 75,
    width: 75,
    height: 75
  }

  const shopButton = {
    x: (canva.width * 0.125) + 75 + 100,
    y: 75,
    width: 75,
    height: 75
  }
  
  function drawButton(button, color) {
    ctx.fillStyle = color
    ctx.fillRect(button.x, button.y, button.width, button.height)
  }
  
  drawButton(returnButton, "pink")
  drawButton(actionButton, "red")

  function handleClick(button1, button2, button3, event) {
    var rect = canva.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    // Return Button    
    if (x > button1.x && x < button1.x + button1.width && y > button1.y && y < button1.y + button1.height) {
      const returnB = document.createElement("a");
      returnB.setAttribute("href", "/src/createPetz/index.html");
      returnB.click();
    }

    // Action button
    if (x > button2.x && x < button2.x + button2.width && y > button2.y && y < button2.y + button2.height) {
      switch (params[2]) {
        case "basic":
          stickmanSprite.src = "./Petz/assets/smoking.svg";
          break;
        case "smoker":
          stickmanSprite.src = "./Petz/assets/smoking.svg";
          break;

        case "heroe":
          stickmanSprite.src = "./Petz/assets/ultraPowerAnim.svg";
          break;

      }
      stickmanSprite.onload = undefined

      switchAn = true;
      allowMovement = false;
      allowStatic = true;

      staticAnimation();
    }

    // Shop Button [DISABLED] 
    if (x > button3.x && x < button3.x + button3.width && y > button3.y && y < button3.y + button3.height) {
      shop = !shop;
    }
  }
  

  function handleMove(button1, button2, button3, event) {
    var rect = canva.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  
    if (x > button1.x && x < button1.x + button1.width && y > button1.y && y < button1.y + button1.height) {
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "auto"
    }

    if (x > button2.x && x < button2.x + button2.width && y > button2.y && y < button2.y + button2.height) {
      // Return button
      document.body.style.cursor = "pointer"
    }

    if (x > button3.x && x < button3.x + button3.width && y > button3.y && y < button3.y + button3.height) {
      // Return button
      document.body.style.cursor = "pointer"
    }
  }

  function addListener(button1, button2, button3) {
    if(!listenerAdded) {
      canva.addEventListener("click", () => {handleClick(button1, button2, button3, event)});
      canva.addEventListener("mousemove", () => {handleMove(button1, button2, button3, event)});
      listenerAdded = true;
    }
  }
  addListener(returnButton, actionButton, shopButton);
}

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

const colorize = (image, r, g, b) => {
    const imageSize = image.width * 3;
  
    const offscreen = new OffscreenCanvas(imageSize, imageSize);
    const ctx = offscreen.getContext("2d");

    ctx.drawImage(image, 0, 0, imageSize, imageSize);

    let imageData = undefined
    if(imageSize != 0) {
      imageData = ctx.getImageData(0, 0, imageSize, imageSize);
    }
  
    for (let i = 0; i < imageData.data.length; i += 4) {
      if(imageData.data[i] == 0) {
        imageData.data[i + 0] = r;
      }

      if(imageData.data[i + 1] == 0) {
        imageData.data[i + 1] = g;
      }

      if(imageData.data[i + 2] == 0) {
        imageData.data[i + 2] = b;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  
    return offscreen;
}

renderBG();
mainRender();

// Game loop 

function staticAnimation() {
  setTimeout(() => {
    if(animationFrame == 3) {
      animationFrame = 0;
      animationLoops += 1;
    } else {
      animationFrame += 1;
    }

    if(!iddle) {
      if(animationLoops == 2) {
        animationLoops = 0;
  
        stickmanSprite.src = "./Petz./Petz/assets/walkingBoth.svg";
        stickmanSprite.onload = undefined
    
        allowMovement = true
        allowStatic = false;
      }
    } else {
      if(animationLoops == 1) {
        animationLoops = 0;
  
        stickmanSprite.src = "./Petz./Petz/assets/walkingBoth.svg";
        stickmanSprite.onload = undefined
    
        allowMovement = true
        allowStatic = false;
        iddle = false
      }
    }


    currentFrame = animationFrame;
    srcX = currentFrame * spriteWidth;

    if(allowStatic) {
      staticAnimation();
    }
  }, 500)
}

let postest = canva.width / 2;
function animate(naspa) {
  if(state >= 0 && state < 5) {
    requestAnimationFrame(() => {animate(naspa)});
  }

  if(allowMovement) {
    if(postest < naspa || postest > naspa) {
      if(postest < naspa) {
        currentFrame = (currentFrame % totalFrames) + 2;
        srcX = currentFrame * spriteWidth;
        postest += 1;
        allowTicking = false;
      } else {
        currentFrame = (currentFrame % totalFrames);
        srcX = currentFrame * spriteWidth;
  
        postest -= 1;
        allowTicking = false;
      }
    }

    if(Math.round(postest) == Math.round(naspa)) {
      currentFrame = 0;
      srcX = currentFrame * spriteWidth;
      postest = naspa
  
      allowTicking = true;
    }   

    freeFrames += 1;
    if(freeFrames > 20) {
      currentFrame++
      freeFrames = 0
    } 

  } else {
    currentFrame = animationFrame;
    srcX = currentFrame * spriteWidth;
  }
}


let switchAn = false;
const gameLoop = () => {
  setTimeout(() => {
    if(allowMovement) {
      state = Math.floor(Math.random() * 10);

      nextPos = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos;

      if(state >= 0 && state < 5) {
        if(switchAn == false) {
          animate(nextPos);
          switchAn = true;
        }
      } else if (state >= 5 && state < 9){
        switchAn = false;
      } else if(state == 9) {
        stickmanSprite.src = "./Petz./Petz/assets/iddle.svg"
        stickmanSprite.onload = undefined

        switchAn = true;
        allowMovement = false;
        allowStatic = true;
        iddle = true
  
        staticAnimation();
      }
    }

    points += 1;

    gameLoop();
  }, 2000);
}

const frameCounting = () => {
  setTimeout(() => { 

    renderBG();
    mainRender();
    buildButtons();

  
    const colorizedImage = colorize(stickmanSprite, hexToRgb(params[0]).r, hexToRgb(params[0]).g, hexToRgb(params[0]).b)
    ctx.drawImage(colorizedImage, srcX, srcY, spriteWidth, spriteHeight, postest, (canva.height - spriteHeight - 150), spriteWidth + 150, spriteHeight);

    shopRender();
    frameCounting();
  }, 10)
}

let stickmanSprite = new Image();
stickmanSprite.src = "./Petz./Petz/assets/walkingBoth.svg";
stickmanSprite.onload = () => {
  gameLoop();
  frameCounting();
  savingSystem();
}

const savingSystem = () => {
  setTimeout(() => {
    localStorage.setItem("points", points);
    savingSystem();
  }, 30000)
}
