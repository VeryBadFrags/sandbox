
export function initTouchListeners(canvas: HTMLCanvasElement) {
    // Touch
    canvas.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener("touchend", (e) => {
        const touch = e.changedTouches[0];
        const mouseEvent = new MouseEvent("mouseup", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        canvas.dispatchEvent(mouseEvent);
    });

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
        "touchstart",
        (e) => {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false,
    );
    document.body.addEventListener(
        "touchend",
        (e) => {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false,
    );
    document.body.addEventListener(
        "touchmove",
        (e) => {
            if (e.target == canvas) {
                e.preventDefault();
            }
        },
        false,
    );
}
