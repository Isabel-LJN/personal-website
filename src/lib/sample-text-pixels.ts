/**
 * Sample text pixels from a DOM element using SVG foreignObject.
 * Captures the exact rendered glyphs (CJK, uppercase, letter-spacing, etc.).
 */
export interface SampledPixel {
  x: number;
  y: number;
}

export async function sampleTextPixels(
  element: HTMLElement,
  step = 3
): Promise<{ pixels: SampledPixel[]; width: number; height: number }> {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  const computed = getComputedStyle(element);
  const text = element.textContent ?? "";
  const safeText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font: ${computed.font};
          font-weight: ${computed.fontWeight};
          font-size: ${computed.fontSize};
          font-family: ${computed.fontFamily};
          letter-spacing: ${computed.letterSpacing};
          text-transform: ${computed.textTransform};
          line-height: ${computed.lineHeight};
          color: #000;
          margin: 0;
          padding: 0;
          width: ${width}px;
          height: ${height}px;
          overflow: hidden;
        ">${safeText}</div>
      </foreignObject>
    </svg>
  `;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { pixels: [], width, height };

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels: SampledPixel[] = [];

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imageData.data[idx + 3] > 100) {
          pixels.push({ x, y });
        }
      }
    }

    return { pixels, width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}
