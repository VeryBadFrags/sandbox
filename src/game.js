const canvas = document.getElementById("game");
import * as Utils from "./utils.js";

export const pixelGrid = Utils.initArray(canvas.width, canvas.height);
export const delta = Utils.initArray(canvas.width, canvas.height, null);
