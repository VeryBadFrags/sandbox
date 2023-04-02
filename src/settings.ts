import * as Display from "./display";
import * as Game from "./game";

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
  Game.wipeBoard();
  Display.drawFull();
});
