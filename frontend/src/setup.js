// https://www.npmjs.com/package/vitest-canvas-mock
import 'vitest-canvas-mock'

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})

//https://github.com/jsdom/jsdom/issues/1782
// Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
//   value: () => ({
//     fillRect: () => {},
//     clearRect: () => {},
//     getImageData: () => ({ data: [] }),
//     putImageData: () => {},
//     createImageData: () => [],
//     setTransform: () => {},
//     drawImage: () => {},
//     save: () => {},
//     fillText: () => {},
//     restore: () => {},
//     beginPath: () => {},
//     moveTo: () => {},
//     lineTo: () => {},
//     closePath: () => {},
//     stroke: () => {},
//     translate: () => {},
//     scale: () => {},
//     rotate: () => {},
//     arc: () => {},
//     fill: () => {},
//     measureText: () => ({ width: 0 }),
//     transform: () => {},
//     rect: () => {},
//     clip: () => {},
//   }),
// });

