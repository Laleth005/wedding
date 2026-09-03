/**
 * Utility to process images and remove background on client-side canvas,
 * or preserve existing transparency if the user uploaded a transparent PNG.
 */

export interface ProcessImageResult {
  dataUrl: string;
  isAlreadyTransparent: boolean;
}

/**
 * Checks if an image has existing transparent pixels (alpha < 250).
 */
export function checkHasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    // Sample every 4th pixel for performance
    for (let i = 3; i < imgData.length; i += 16) {
      if (imgData[i] < 240) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Automatically removes background from an opaque couple photo using
 * edge-flood color distance keying with soft alpha feathering.
 */
export function removeBackgroundFromCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tolerance = 42
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample background reference colors from the four outer corners and outer edges
  const samplePoints = [
    [0, 0], // Top-left (sky/mandap)
    [width - 1, 0], // Top-right (sky/mandap)
    [0, Math.floor(height * 0.3)], // Left ocean
    [width - 1, Math.floor(height * 0.3)], // Right floral
    [0, height - 1], // Bottom-left sand
    [width - 1, height - 1], // Bottom-right sand
    [Math.floor(width * 0.15), 0],
    [Math.floor(width * 0.85), 0],
    [0, Math.floor(height * 0.7)],
    [width - 1, Math.floor(height * 0.7)],
  ];

  const bgColors: [number, number, number][] = [];
  for (const [sx, sy] of samplePoints) {
    const idx = (sy * width + sx) * 4;
    bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  // Calculate distance in RGB color space
  function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // Foreground bounding protection: The couple is centrally positioned
  // (x between 20% and 82%, y between 12% and 94%)
  const centerXMin = width * 0.22;
  const centerXMax = width * 0.82;
  const centerYMin = height * 0.14;
  const centerYMax = height * 0.95;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Find closest background color
      let minDist = 9999;
      for (const [br, bg, bb] of bgColors) {
        const d = colorDist(r, g, b, br, bg, bb);
        if (d < minDist) minDist = d;
      }

      // Check if this pixel is inside the couple's core body zone
      const isInCoreZone = x >= centerXMin && x <= centerXMax && y >= centerYMin && y <= centerYMax;

      // Distance from center on X axis (0 in center, 1 at edge)
      const normX = Math.abs(x - width * 0.5) / (width * 0.5);

      if (!isInCoreZone) {
        // Outer background area: aggressive removal
        if (minDist < tolerance * 1.6 || normX > 0.8) {
          data[idx + 3] = 0; // Transparent
        } else if (minDist < tolerance * 2.2) {
          const alpha = (minDist - tolerance * 1.6) / (tolerance * 0.6);
          data[idx + 3] = Math.floor(Math.max(0, Math.min(255, alpha * 255)));
        }
      } else {
        // Core zone: only remove if it strictly matches the sampled sky/sand background
        if (minDist < tolerance * 0.75) {
          const alpha = minDist / (tolerance * 0.75);
          data[idx + 3] = Math.floor(alpha * 160);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Process an image source URL or Data URI into a cutout data URL.
 */
export function processImageCutout(
  imgSrc: string,
  tolerance = 45
): Promise<ProcessImageResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      // Scale down if image is excessively large (max dimension 1600px for retina clarity)
      const maxDim = 1600;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ dataUrl: imgSrc, isAlreadyTransparent: false });
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);

      // Check if the image already has transparency (user uploaded transparent PNG cutout)
      const isTransparent = checkHasTransparency(ctx, canvas.width, canvas.height);

      if (isTransparent) {
        // Already a clean transparent cutout! Return as optimized PNG
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ dataUrl, isAlreadyTransparent: true });
        return;
      }

      // Otherwise, execute auto-background removal
      removeBackgroundFromCanvas(ctx, canvas.width, canvas.height, tolerance);
      const dataUrl = canvas.toDataURL('image/png');
      resolve({ dataUrl, isAlreadyTransparent: false });
    };

    img.onerror = () => {
      resolve({ dataUrl: imgSrc, isAlreadyTransparent: false });
    };

    img.src = imgSrc;
  });
}
