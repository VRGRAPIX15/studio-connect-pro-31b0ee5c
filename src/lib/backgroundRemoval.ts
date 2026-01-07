// Background Removal using Hugging Face Transformers
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

let segmenter: any = null;
let isLoading = false;

// Initialize the segmentation model (call this early)
export async function initBackgroundRemoval(): Promise<boolean> {
  if (segmenter) return true;
  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return segmenter !== null;
  }
  
  isLoading = true;
  try {
    console.log('Loading segmentation model...');
    segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    console.log('Segmentation model loaded!');
    isLoading = false;
    return true;
  } catch (error) {
    console.error('Failed to load segmentation model:', error);
    isLoading = false;
    return false;
  }
}

function resizeImageIfNeeded(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement
): boolean {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export interface BackgroundRemovalResult {
  success: boolean;
  imageBlob?: Blob;
  imageUrl?: string;
  error?: string;
}

export async function removeBackground(imageElement: HTMLImageElement): Promise<BackgroundRemovalResult> {
  try {
    console.log('Starting background removal process...');
    
    // Initialize if not already
    const initialized = await initBackgroundRemoval();
    if (!initialized || !segmenter) {
      return { success: false, error: 'Failed to initialize segmentation model' };
    }
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { success: false, error: 'Could not get canvas context' };
    }
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      return { success: false, error: 'Invalid segmentation result' };
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) {
      return { success: false, error: 'Could not get output canvas context' };
    }
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel (keep subject, remove background)
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve({ 
              success: true, 
              imageBlob: blob,
              imageUrl: URL.createObjectURL(blob)
            });
          } else {
            resolve({ success: false, error: 'Failed to create blob' });
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Replace background with a solid color
export async function replaceBackground(
  imageElement: HTMLImageElement, 
  bgColor: string
): Promise<BackgroundRemovalResult> {
  const removeResult = await removeBackground(imageElement);
  
  if (!removeResult.success || !removeResult.imageBlob) {
    return removeResult;
  }
  
  // Create new image from blob
  const img = await loadImageFromBlob(removeResult.imageBlob);
  
  // Create canvas with colored background
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the transparent image on top
  ctx.drawImage(img, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ 
            success: true, 
            imageBlob: blob,
            imageUrl: URL.createObjectURL(blob)
          });
        } else {
          resolve({ success: false, error: 'Failed to create blob' });
        }
      },
      'image/png',
      1.0
    );
  });
}

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
