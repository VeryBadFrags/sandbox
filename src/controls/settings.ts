import { drawFull } from "../display.ts";
import { wipeBoard } from "../game.ts";

export let play = true;

const playPauseButton = document.getElementById(
  "play-pause",
) as HTMLButtonElement;

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
{
  playPauseButton.addEventListener("click", togglePlay);

  const eraseButton = document.getElementById(
    "erase-button",
  ) as HTMLButtonElement;
  eraseButton.addEventListener("click", () => {
    wipeBoard();
    drawFull();
  });
}
