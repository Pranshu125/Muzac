// Fast client-side dynamic color extractor from album art using Canvas
export async function extractDominantColor(imageUrl: string): Promise<{ primary: string; secondary: string; rgb: [number, number, number] }> {
  return new Promise((resolve) => {
    // Fallback colors
    const fallback = {
      primary: '#6366f1',
      secondary: '#a855f7',
      rgb: [99, 102, 241] as [number, number, number]
    };

    if (!imageUrl) {
      resolve(fallback);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(fallback);
          return;
        }

        // Small sample for fast processing
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);

        const imageData = ctx.getImageData(0, 0, 40, 40).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 16) {
          const red = imageData[i];
          const green = imageData[i + 1];
          const blue = imageData[i + 2];
          
          // Filter out pure black / pure white
          const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
          if (brightness > 25 && brightness < 235) {
            r += red;
            g += green;
            b += blue;
            count++;
          }
        }

        if (count === 0) {
          resolve(fallback);
          return;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Boost vibrancy slightly if color is too dull
        const primary = `rgb(${r}, ${g}, ${b})`;
        const secondary = `rgb(${Math.min(255, Math.floor(r * 1.3))}, ${Math.min(255, Math.floor(g * 0.9))}, ${Math.min(255, Math.floor(b * 1.4))})`;

        resolve({
          primary,
          secondary,
          rgb: [r, g, b]
        });
      } catch (err) {
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve(fallback);
    };
  });
}
