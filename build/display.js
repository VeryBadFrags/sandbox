const canvas = document.getElementById("game");
const context = canvas.getContext("2d", {alpha: false});
let imagedata = context.createImageData(canvas.width, canvas.height);
export function drawFull(gameState, lightMap) {
  imagedata = context.createImageData(canvas.width, canvas.height);
  const gameWidth = gameState.length;
  const gameHeight = gameState[0].length;
  for (let x = 0; x < gameWidth; x++) {
    const column = gameState[x];
    for (let y = 0; y < gameHeight; y++) {
      const cell = column[y];
      if (cell) {
        let pixelindex = (y * gameWidth + x) * 4;
        imagedata.data[pixelindex] = cell.rgb[0];
        imagedata.data[pixelindex + 1] = cell.rgb[1];
        imagedata.data[pixelindex + 2] = cell.rgb[2];
        imagedata.data[pixelindex + 3] = 255;
      }
    }
  }
  context.putImageData(imagedata, 0, 0);
}
export function drawPartial(deltaBoard) {
  const gameWidth = deltaBoard.length;
  const gameHeight = deltaBoard[0].length;
  for (let x = 0; x < gameWidth; x++) {
    const column = deltaBoard[x];
    for (let y = 0; y < gameHeight; y++) {
      const cell = column[y];
      if (cell) {
        let pixelindex = (y * gameWidth + x) * 4;
        imagedata.data[pixelindex] = cell.rgb[0];
        imagedata.data[pixelindex + 1] = cell.rgb[1];
        imagedata.data[pixelindex + 2] = cell.rgb[2];
        imagedata.data[pixelindex + 3] = 255;
      }
    }
  }
  context.putImageData(imagedata, 0, 0);
}
export function drawPartialDynamic(deltaBoard, fullBoard, lightMap) {
  const gameWidth = deltaBoard.length;
  const gameHeight = deltaBoard[0].length;
  for (let i = 0; i < gameWidth; i++) {
    const column = deltaBoard[i];
    for (let j = 0; j < gameHeight; j++) {
      let cell = column[j];
      if (cell) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      } else if (lightMap && lightMap[i][j] > 0) {
        cell = fullBoard[i][j];
        context.fillStyle = getHexColor(cell, lightMap[i][j]);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}
function getHexColor(cell, lightValue) {
  if (lightValue > 0) {
    const hsl = cell.hsl;
    const newL = Math.min(hsl[2] + Math.floor(lightValue * 0.4), 100);
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${newL}%)`;
  } else {
    return cell.color;
  }
}
