import confetti from "canvas-confetti";

/**
* Triggers confetti cannons from both sides of the screen
*
* @param {number} [duration=3000] - Duration in milliseconds for which the confetti effect will run
* @returns {void}
* @description Launches confetti particles from the left and right sides of the screen using canvas-confetti.
* The function uses four pastel colors and creates a continuous animation until the specified duration ends.
*/
export function TiggerSideCannon(duration = 3000) {
  const end = Date.now() + duration;
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
}
