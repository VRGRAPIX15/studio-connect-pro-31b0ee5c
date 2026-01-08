import { useState } from 'react';
import { Eraser, Loader2, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { removeBackground, replaceBackground, initBackgroundRemoval, loadImageFromUrl } from '@/lib/backgroundRemoval';
import { BACKGROUND_COLORS } from '@/data/countryTemplates';

interface BackgroundRemoverProps {
  sourceImage: string | null;
  onImageProcessed: (processedImage: string) => void;
}

export function BackgroundRemover({ sourceImage, onImageProcessed }: BackgroundRemoverProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedBgColor, setSelectedBgColor] = useState(BACKGROUND_COLORS[0]);

  const handleInitModel = async () => {
    setIsInitializing(true);
    try {
      await initBackgroundRemoval();
      setIsModelReady(true);
      toast.success('AI model loaded successfully!');
    } catch (error) {
      console.error('Failed to initialize model:', error);
      toast.error('Failed to load AI model. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!sourceImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    try {
      const imgElement = await loadImageFromUrl(sourceImage);
      const result = await removeBackground(imgElement);
      if (result.success && result.imageUrl) {
        setProcessedImage(result.imageUrl);
        toast.success('Background removed successfully!');
      } else {
        toast.error(result.error || 'Failed to remove background');
      }
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Failed to remove background');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceBackground = async (color: typeof BACKGROUND_COLORS[0]) => {
    if (!sourceImage) {
      toast.error('Please upload an image first');
      return;
    }

    setSelectedBgColor(color);
    setIsProcessing(true);
    try {
      const imgElement = await loadImageFromUrl(sourceImage);
      const result = await replaceBackground(imgElement, color.color);
      if (result.success && result.imageUrl) {
        setProcessedImage(result.imageUrl);
        onImageProcessed(result.imageUrl);
        toast.success(`Background changed to ${color.name}!`);
      } else {
        toast.error(result.error || 'Failed to replace background');
      }
    } catch (error) {
      console.error('Background replacement failed:', error);
      toast.error('Failed to replace background');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (processedImage) {
      onImageProcessed(processedImage);
      toast.success('Background applied!');
    }
  };

  if (!isModelReady) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eraser className="h-5 w-5 text-primary" />
            AI Background Removal
          </CardTitle>
          <CardDescription>
            Remove and replace photo backgrounds using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Load the AI model to enable background removal. This may take a moment on first use.
            </p>
            <Button 
              onClick={handleInitModel} 
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading AI Model...
                </>
              ) : (
                <>
                  <Eraser className="h-4 w-4 mr-2" />
                  Load AI Model
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eraser className="h-5 w-5 text-primary" />
          Background
          <Check className="h-4 w-4 text-green-500" />
        </CardTitle>
        <CardDescription>
          AI model ready - Select a background color
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Color Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Background Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleReplaceBackground(color)}
                disabled={isProcessing || !sourceImage}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedBgColor.name === color.name
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div 
                  className="w-full h-8 rounded mb-1"
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-4 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Processing with AI...</span>
          </div>
        )}

        {/* Preview */}
        {processedImage && !isProcessing && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            </div>
            <Button onClick={handleApply} className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Apply to Photo
            </Button>
          </div>
        )}

        {!sourceImage && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Upload a photo first to use background removal
          </p>
        )}
      </CardContent>
    </Card>
  );
}
