"use client";

import React from "react";
import confetti from "canvas-confetti";

/**
 * Creates a side-firing confetti animation effect for 3 seconds
 * 
 * Launches colorful confetti particles from both left and right sides of the screen
 * toward the center. Component doesn't render any visible elements.
 * 
 * @returns {null} Component doesn't render any DOM elements
 */
export function ConfettiSideCannons() {
  React.useEffect(() => {
    const end = Date.now() + 3 * 1000;
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
  }, []);

  return null;
}
