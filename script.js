let petParams = document.getElementsByTagName("input")
let classParam = document.getElementsByTagName("select")

let canva = document.getElementById("canva");
const ctx = canva.getContext("2d");
canva.height = window.innerHeight;
canva.width = window.innerWidth;

let bgCanva = document.getElementById("bgCanva");
const bgCtx = bgCanva.getContext("2d");
bgCanva.height = window.innerHeight;
bgCanva.width = window.innerWidth;

let height = 400;

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

const renderDraw = () => {
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(50, 50, 100, 100)
}

const mainRender = () => {

  let loaded = 0;

  function imgLoaded() {
    loaded++
    if(loaded >= 1) {
    }
  }

  const box = new Image();
  box.src ="./Petz/assets/boxPNG.png";
  box.onload = () => {
    const extraScale = 150;
    ctx.drawImage(box, (canva.width / 2) - ((box.width + extraScale) / 2), (canva.height / 2) - ((box.height + extraScale) / 2), box.width + extraScale, box.height + extraScale); 
    imgLoaded()
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canva.width * 0.125, canva.height)
  ctx.fillRect(canva.width - (canva.width * 0.125), 0, canva.width * 0.125, canva.height)

  const img = new Image();
  img.src = "./Petz/assets/stickmanPTY.svg";
  img.onload = () => {
    ctx.drawImage(img, (canva.width / 2) - ((img.width + 150) / 2), (canva.height / 2) - ((img.height + 150) / 2), img.width + 150, img.height + 150); 
  }

  const colorize = (image, r, g, b) => {
    const imageSize = image.width;
  
    const offscreen = new OffscreenCanvas(imageSize, imageSize);
    const ctx = offscreen.getContext("2d");
  
    ctx.drawImage(image, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, imageSize, imageSize);
  
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
    }
  
    ctx.putImageData(imageData, 0, 0);
  
    return offscreen;
  }

  petParams[0].addEventListener('input', () => {
    const colorizedImage = colorize(img, hexToRgb(petParams[0].value).r, hexToRgb(petParams[0].value).g, hexToRgb(petParams[0].value).b);
    ctx.drawImage(colorizedImage, (canva.width / 2) - ((img.width + 150) / 2), (canva.height / 2) - ((img.height + 150) / 2), img.width + 150, img.height + 150);
  })

}

const renderBG = () => {
    const bg = new Image();
    bg.src = "./Petz/assets/bg2.svg"
    bg.onload = () => {
      var pattern = bgCtx.createPattern(bg, 'repeat');
      var patternOffsetX = 0;
      var patternOffsetY = 0;

      function animate() {
        bgCtx.clearRect(0, 0, bgCanva.width, bgCanva.height);

        patternOffsetX = (patternOffsetX - 0.25) % bg.width; 
        patternOffsetY = (patternOffsetY - 0.25) % bg.height;

        bgCtx.save();
        bgCtx.translate(patternOffsetX, patternOffsetY);
        bgCtx.fillStyle = pattern;
        bgCtx.fillRect(-patternOffsetX, -patternOffsetY, bgCanva.width + bg.width, bgCanva.height + bg.height);
        bgCtx.restore();

        requestAnimationFrame(animate);
      }
      animate();
    }
}

const submitRes = () => {
    let name = petParams[0]
    let colour = petParams[1]
    let classP = classParam[0]

    let params = "./Petz/playPetz/index.html" + "?id=" + btoa([name.value, colour.value, classP.value].join('|'))
    console.log(params)
    document.getElementsByTagName("a")[0].setAttribute("href", params)
    document.getElementsByTagName("a")[0].click()
}

window.addEventListener("resize", () => {
  canva.height = window.innerHeight;
  canva.width = window.innerWidth;

  bgCanva.height = window.innerHeight;
  bgCanva.width = window.innerWidth;

  renderBG();
  mainRender();
})

renderBG();
mainRender();
