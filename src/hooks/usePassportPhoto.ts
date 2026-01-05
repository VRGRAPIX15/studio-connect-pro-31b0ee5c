import { useState, useCallback, useRef } from 'react';
import { PhotoSize, PhotoAdjustments, PrintLayout, PHOTO_SIZES, PRINT_LAYOUTS, defaultAdjustments } from '@/types/passport';

export function usePassportPhoto() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(PHOTO_SIZES[0]);
  const [selectedLayout, setSelectedLayout] = useState<PrintLayout>(PRINT_LAYOUTS[0]);
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(defaultAdjustments);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load image from file
  const loadImage = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSourceImage(result);
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Load image from URL/data URL
  const loadImageFromUrl = useCallback((url: string) => {
    setSourceImage(url);
  }, []);

  // Reset adjustments
  const resetAdjustments = useCallback(() => {
    setAdjustments(defaultAdjustments);
  }, []);

  // Apply adjustments and generate cropped image
  const applyAdjustments = useCallback(async (): Promise<string | null> => {
    if (!sourceImage) return null;
    
    setIsProcessing(true);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas to target size
        canvas.width = selectedSize.widthPx;
        canvas.height = selectedSize.heightPx;
        
        // Fill background
        ctx.fillStyle = selectedSize.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((adjustments.rotation * Math.PI) / 180);
        ctx.scale(adjustments.scale, adjustments.scale);
        ctx.translate(-canvas.width / 2 + adjustments.offsetX, -canvas.height / 2 + adjustments.offsetY);
        
        // Apply filters
        ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
        
        // Calculate aspect-fill dimensions
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider - fit height
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller - fit width
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspect;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
        
        const result = canvas.toDataURL('image/jpeg', 1.0);
        setCroppedImage(result);
        setIsProcessing(false);
        resolve(result);
      };
      img.src = sourceImage;
    });
  }, [sourceImage, selectedSize, adjustments]);

  // Generate print layout
  const generatePrintLayout = useCallback(async (): Promise<string | null> => {
    if (!croppedImage) {
      await applyAdjustments();
    }
    
    const imageToUse = croppedImage || (await applyAdjustments());
    if (!imageToUse) return null;
    
    setIsProcessing(true);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // 4x6 at 300 DPI
        const DPI = 300;
        canvas.width = selectedLayout.paperWidthInch * DPI;
        canvas.height = selectedLayout.paperHeightInch * DPI;
        
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate photo dimensions in pixels at 300 DPI
        const photoWidthPx = (selectedSize.widthMM / 25.4) * DPI;
        const photoHeightPx = (selectedSize.heightMM / 25.4) * DPI;
        const marginPx = (selectedLayout.marginMM / 25.4) * DPI;
        const gapPx = (selectedLayout.gapMM / 25.4) * DPI;
        
        // Calculate grid
        const { columns, rows } = selectedLayout;
        
        // Calculate total grid size
        const totalGridWidth = columns * photoWidthPx + (columns - 1) * gapPx;
        const totalGridHeight = rows * photoHeightPx + (rows - 1) * gapPx;
        
        // Center the grid
        const startX = (canvas.width - totalGridWidth) / 2;
        const startY = (canvas.height - totalGridHeight) / 2;
        
        // Draw photos in grid
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const x = startX + col * (photoWidthPx + gapPx);
            const y = startY + row * (photoHeightPx + gapPx);
            
            // Draw photo with high quality
            ctx.drawImage(img, x, y, photoWidthPx, photoHeightPx);
            
            // Draw thin border for cutting guide
            ctx.strokeStyle = '#CCCCCC';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
          }
        }
        
        // Add cutting marks at corners
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        const markLength = 20;
        
        // Top-left
        ctx.beginPath();
        ctx.moveTo(marginPx, marginPx);
        ctx.lineTo(marginPx + markLength, marginPx);
        ctx.moveTo(marginPx, marginPx);
        ctx.lineTo(marginPx, marginPx + markLength);
        ctx.stroke();
        
        // Top-right
        ctx.beginPath();
        ctx.moveTo(canvas.width - marginPx, marginPx);
        ctx.lineTo(canvas.width - marginPx - markLength, marginPx);
        ctx.moveTo(canvas.width - marginPx, marginPx);
        ctx.lineTo(canvas.width - marginPx, marginPx + markLength);
        ctx.stroke();
        
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(marginPx, canvas.height - marginPx);
        ctx.lineTo(marginPx + markLength, canvas.height - marginPx);
        ctx.moveTo(marginPx, canvas.height - marginPx);
        ctx.lineTo(marginPx, canvas.height - marginPx - markLength);
        ctx.stroke();
        
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(canvas.width - marginPx, canvas.height - marginPx);
        ctx.lineTo(canvas.width - marginPx - markLength, canvas.height - marginPx);
        ctx.moveTo(canvas.width - marginPx, canvas.height - marginPx);
        ctx.lineTo(canvas.width - marginPx, canvas.height - marginPx - markLength);
        ctx.stroke();
        
        const result = canvas.toDataURL('image/jpeg', 1.0);
        setIsProcessing(false);
        resolve(result);
      };
      img.src = imageToUse;
    });
  }, [croppedImage, applyAdjustments, selectedSize, selectedLayout]);

  // Download image
  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  // Print image
  const printImage = useCallback((dataUrl: string, layout: PrintLayout) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const paperWidth = layout.paperWidthInch;
      const paperHeight = layout.paperHeightInch;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Passport Photos</title>
            <style>
              @page {
                size: ${paperWidth}in ${paperHeight}in;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              img {
                width: ${paperWidth}in;
                height: ${paperHeight}in;
                object-fit: contain;
              }
              @media print {
                body { margin: 0; }
                img { 
                  width: 100%;
                  height: 100%;
                  page-break-after: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setSourceImage(null);
    setCroppedImage(null);
    setAdjustments(defaultAdjustments);
  }, []);

  return {
    // State
    sourceImage,
    croppedImage,
    selectedSize,
    selectedLayout,
    adjustments,
    isProcessing,
    canvasRef,
    
    // Setters
    setSelectedSize,
    setSelectedLayout,
    setAdjustments,
    
    // Actions
    loadImage,
    loadImageFromUrl,
    resetAdjustments,
    applyAdjustments,
    generatePrintLayout,
    downloadImage,
    printImage,
    clearAll,
    
    // Data
    photoSizes: PHOTO_SIZES,
    printLayouts: PRINT_LAYOUTS,
  };
}
