import { useState } from 'react';
import { Sparkles, Loader2, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { autoEnhance, applyEnhancement, EnhancementSettings, analyzeImage } from '@/lib/autoEnhance';
import { loadImageFromUrl } from '@/lib/backgroundRemoval';

interface AutoEnhancerProps {
  sourceImage: string | null;
  onImageEnhanced: (enhancedImage: string) => void;
}

const defaultSettings: EnhancementSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  temperature: 0
};

interface ImageAnalysis {
  avgBrightness: number;
  contrast: number;
  saturation: number;
  needsEnhancement: boolean;
}

export function AutoEnhancer({ sourceImage, onImageEnhanced }: AutoEnhancerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<EnhancementSettings>(defaultSettings);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);

  const handleAutoEnhance = async () => {
    if (!sourceImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    try {
      const imgElement = await loadImageFromUrl(sourceImage);
      const result = await autoEnhance(imgElement);
      setEnhancedImage(result.previewUrl);
      setSettings(result.settings);
      
      // Create analysis from settings
      const analysisResult: ImageAnalysis = {
        avgBrightness: result.settings.brightness,
        contrast: result.settings.contrast,
        saturation: result.settings.saturation,
        needsEnhancement: result.settings.brightness !== 100 || result.settings.contrast !== 100
      };
      setAnalysis(analysisResult);
      onImageEnhanced(result.previewUrl);
      toast.success('Photo enhanced automatically!');
    } catch (error) {
      console.error('Auto-enhance failed:', error);
      toast.error('Failed to enhance photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySettings = async () => {
    if (!sourceImage) return;

    setIsProcessing(true);
    try {
      const imgElement = await loadImageFromUrl(sourceImage);
      const canvas = applyEnhancement(imgElement, settings, imgElement.naturalWidth, imgElement.naturalHeight);
      const resultUrl = canvas.toDataURL('image/jpeg', 0.95);
      setEnhancedImage(resultUrl);
      onImageEnhanced(resultUrl);
      toast.success('Enhancements applied!');
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Failed to apply enhancements');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setEnhancedImage(null);
    setAnalysis(null);
  };

  const updateSetting = (key: keyof EnhancementSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Photo Enhancement
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </CardTitle>
        <CardDescription>
          Auto-enhance or manually adjust photo quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* One-Click Auto Enhance */}
        <Button 
          onClick={handleAutoEnhance} 
          disabled={isProcessing || !sourceImage}
          className="w-full"
          variant="default"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              One-Click Auto Enhance
            </>
          )}
        </Button>

        {/* Analysis Results */}
        {analysis && (
          <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-1">
            <div className="font-medium mb-2">Analysis Results:</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Brightness: {analysis.avgBrightness.toFixed(0)}</div>
              <div>Contrast: {analysis.contrast.toFixed(0)}</div>
              <div>Saturation: {analysis.saturation.toFixed(0)}</div>
              <div>Quality: {analysis.needsEnhancement ? 'Needs work' : 'Good'}</div>
            </div>
          </div>
        )}

        <Separator />

        {/* Manual Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Manual Adjustments</Label>

          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Brightness</span>
              <span className="text-muted-foreground">{settings.brightness}%</span>
            </div>
            <Slider
              value={[settings.brightness]}
              onValueChange={([v]) => updateSetting('brightness', v)}
              min={50}
              max={150}
              step={1}
            />
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contrast</span>
              <span className="text-muted-foreground">{settings.contrast}%</span>
            </div>
            <Slider
              value={[settings.contrast]}
              onValueChange={([v]) => updateSetting('contrast', v)}
              min={50}
              max={150}
              step={1}
            />
          </div>

          {/* Saturation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Saturation</span>
              <span className="text-muted-foreground">{settings.saturation}%</span>
            </div>
            <Slider
              value={[settings.saturation]}
              onValueChange={([v]) => updateSetting('saturation', v)}
              min={0}
              max={200}
              step={1}
            />
          </div>

          {/* Sharpness */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sharpness</span>
              <span className="text-muted-foreground">{settings.sharpness}</span>
            </div>
            <Slider
              value={[settings.sharpness]}
              onValueChange={([v]) => updateSetting('sharpness', v)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Temperature</span>
              <span className="text-muted-foreground">
                {settings.temperature > 0 ? `+${settings.temperature}` : settings.temperature}
              </span>
            </div>
            <Slider
              value={[settings.temperature]}
              onValueChange={([v]) => updateSetting('temperature', v)}
              min={-50}
              max={50}
              step={1}
            />
          </div>
        </div>

        <Button 
          onClick={handleApplySettings} 
          disabled={isProcessing || !sourceImage}
          className="w-full"
          variant="secondary"
        >
          <Check className="h-4 w-4 mr-2" />
          Apply Manual Adjustments
        </Button>

        {/* Preview */}
        {enhancedImage && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Enhanced Preview</Label>
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={enhancedImage}
                alt="Enhanced"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
