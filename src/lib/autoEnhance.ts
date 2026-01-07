// Auto-enhancement utilities for passport photos

export interface EnhancementSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  temperature: number; // warm/cool
}

export const defaultEnhancement: EnhancementSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  temperature: 0,
};

// Analyze image and suggest optimal settings
export async function analyzeImage(imageElement: HTMLImageElement): Promise<EnhancementSettings> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Use smaller size for analysis
  const analysisSize = 200;
  const aspectRatio = imageElement.width / imageElement.height;
  
  if (aspectRatio > 1) {
    canvas.width = analysisSize;
    canvas.height = analysisSize / aspectRatio;
  } else {
    canvas.width = analysisSize * aspectRatio;
    canvas.height = analysisSize;
  }
  
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Calculate average brightness
  let totalBrightness = 0;
  let totalR = 0, totalG = 0, totalB = 0;
  const pixelCount = data.length / 4;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived brightness formula
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
    totalR += r;
    totalG += g;
    totalB += b;
  }
  
  const avgBrightness = totalBrightness / pixelCount;
  const avgR = totalR / pixelCount;
  const avgG = totalG / pixelCount;
  const avgB = totalB / pixelCount;
  
  // Calculate contrast (standard deviation of brightness)
  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    varianceSum += Math.pow(brightness - avgBrightness, 2);
  }
  const stdDev = Math.sqrt(varianceSum / pixelCount);
  
  // Suggest settings based on analysis
  const suggestions: EnhancementSettings = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    temperature: 0,
  };
  
  // Target brightness for passport photo: ~140-160 (well-lit)
  const targetBrightness = 150;
  if (avgBrightness < 100) {
    // Image is dark
    suggestions.brightness = Math.min(150, 100 + (targetBrightness - avgBrightness) * 0.4);
  } else if (avgBrightness > 200) {
    // Image is too bright
    suggestions.brightness = Math.max(70, 100 - (avgBrightness - targetBrightness) * 0.3);
  }
  
  // Target contrast (std dev): ~50-70
  const targetStdDev = 60;
  if (stdDev < 40) {
    // Low contrast
    suggestions.contrast = Math.min(140, 100 + (targetStdDev - stdDev) * 0.8);
  } else if (stdDev > 80) {
    // High contrast
    suggestions.contrast = Math.max(80, 100 - (stdDev - targetStdDev) * 0.3);
  }
  
  // Saturation adjustment - slightly boost for natural skin tones
  const avgColor = (avgR + avgG + avgB) / 3;
  const colorVariance = Math.abs(avgR - avgColor) + Math.abs(avgG - avgColor) + Math.abs(avgB - avgColor);
  if (colorVariance < 20) {
    // Low saturation
    suggestions.saturation = 115;
  } else if (colorVariance > 50) {
    // High saturation
    suggestions.saturation = 90;
  }
  
  // Temperature adjustment based on color cast
  const tempDiff = avgR - avgB;
  if (tempDiff > 20) {
    // Too warm (yellow/orange cast)
    suggestions.temperature = -Math.min(30, tempDiff * 0.5);
  } else if (tempDiff < -20) {
    // Too cool (blue cast)
    suggestions.temperature = Math.min(30, Math.abs(tempDiff) * 0.5);
  }
  
  // Always add slight sharpness for passport photos
  suggestions.sharpness = 10;
  
  return suggestions;
}

// Apply enhancement settings to canvas
export function applyEnhancement(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  settings: EnhancementSettings,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  
  // Build filter string
  const filters: string[] = [];
  
  if (settings.brightness !== 100) {
    filters.push(`brightness(${settings.brightness}%)`);
  }
  if (settings.contrast !== 100) {
    filters.push(`contrast(${settings.contrast}%)`);
  }
  if (settings.saturation !== 100) {
    filters.push(`saturate(${settings.saturation}%)`);
  }
  
  // Temperature is simulated via sepia + hue-rotate
  if (settings.temperature !== 0) {
    if (settings.temperature > 0) {
      filters.push(`sepia(${settings.temperature * 0.3}%)`);
    } else {
      filters.push(`hue-rotate(${settings.temperature}deg)`);
    }
  }
  
  ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
  
  // Draw image
  ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
  
  // Apply sharpness (using convolution)
  if (settings.sharpness > 0) {
    applySharpness(ctx, targetWidth, targetHeight, settings.sharpness / 100);
  }
  
  return canvas;
}

// Simple sharpening using unsharp mask technique
function applySharpness(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  amount: number
): void {
  if (amount <= 0) return;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const dataCopy = new Uint8ClampedArray(data);
  
  // Simple 3x3 sharpening kernel
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  const mix = Math.min(amount, 0.5);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const kidx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += dataCopy[kidx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[idx + c] = Math.round(dataCopy[idx + c] * (1 - mix) + sum * mix);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// One-click auto enhance
export async function autoEnhance(imageElement: HTMLImageElement): Promise<{
  settings: EnhancementSettings;
  previewUrl: string;
}> {
  const settings = await analyzeImage(imageElement);
  
  const canvas = applyEnhancement(
    imageElement, 
    settings, 
    imageElement.naturalWidth, 
    imageElement.naturalHeight
  );
  
  return {
    settings,
    previewUrl: canvas.toDataURL('image/jpeg', 0.95)
  };
}
