import * as CellType from "./celltype.js";
import * as Display from "./display.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";

export let play = true;

export const togglePlay = () => {
  play = !play;
  if (play) {
    playPauseButton.classList.add("btn-outline-primary");
    playPauseButton.classList.remove("btn-outline-danger");
  } else {
    playPauseButton.classList.remove("btn-outline-primary");
    playPauseButton.classList.add("btn-outline-danger");
  }
};

// Listeners

const playPauseButton = document.getElementById(
  "play-pause"
) as HTMLButtonElement;
playPauseButton.addEventListener("click", togglePlay);

const eraseButton = document.getElementById(
  "erase-button"
) as HTMLButtonElement;
eraseButton.addEventListener("click", () => {
  Utils.wipeMatrix(Game.pixelGrid, CellType.empty);
  Display.drawFull(Game.pixelGrid);
});
