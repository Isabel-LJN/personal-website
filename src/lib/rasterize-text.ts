/**
 * Rasterize a DOM text element into a high-resolution canvas texture.
 * Preserves computed font styles (CJK, uppercase, letter-spacing, etc.).
 */
export async function rasterizeTextElement(
  element: HTMLElement,
  scale = 2
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
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
          color: ${computed.color};
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
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { canvas, width, height };

    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    return { canvas, width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}
