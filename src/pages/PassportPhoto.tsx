import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Download, 
  Printer, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Sun,
  Contrast,
  Droplets,
  RotateCw,
  Move,
  Grid,
  Image as ImageIcon,
  Trash2,
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { usePassportPhoto } from '@/hooks/usePassportPhoto';
import { PHOTO_SIZES, PRINT_LAYOUTS } from '@/types/passport';

export default function PassportPhoto() {
  const {
    sourceImage,
    croppedImage,
    selectedSize,
    selectedLayout,
    adjustments,
    isProcessing,
    setSelectedSize,
    setSelectedLayout,
    setAdjustments,
    loadImage,
    loadImageFromUrl,
    resetAdjustments,
    applyAdjustments,
    generatePrintLayout,
    downloadImage,
    printImage,
    clearAll,
  } = usePassportPhoto();

  const [activeTab, setActiveTab] = useState('capture');
  const [printLayoutImage, setPrintLayoutImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error('Camera access denied. Please allow camera access.');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
      loadImageFromUrl(dataUrl);
      stopCamera();
      setActiveTab('adjust');
      toast.success('Photo captured!');
    }
  }, [loadImageFromUrl, stopCamera]);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file).then(() => {
        setActiveTab('adjust');
        toast.success('Photo loaded!');
      });
    }
  }, [loadImage]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
          const blob = await item.getType(item.types.find(t => t.startsWith('image/'))!);
          const reader = new FileReader();
          reader.onload = (e) => {
            loadImageFromUrl(e.target?.result as string);
            setActiveTab('adjust');
            toast.success('Photo pasted from clipboard!');
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      toast.error('No image found in clipboard');
    } catch {
      toast.error('Unable to paste. Try using Ctrl+V while focused on the page.');
    }
  }, [loadImageFromUrl]);

  // Apply and preview
  const handleApply = useCallback(async () => {
    await applyAdjustments();
    toast.success('Adjustments applied!');
  }, [applyAdjustments]);

  // Generate print layout
  const handleGeneratePrint = useCallback(async () => {
    const result = await generatePrintLayout();
    if (result) {
      setPrintLayoutImage(result);
      setActiveTab('print');
      toast.success('Print layout generated!');
    }
  }, [generatePrintLayout]);

  // Download print layout
  const handleDownload = useCallback(() => {
    if (printLayoutImage) {
      const filename = `passport_photos_${selectedSize.name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      downloadImage(printLayoutImage, filename);
      toast.success('Image downloaded!');
    }
  }, [printLayoutImage, selectedSize, downloadImage]);

  // Print
  const handlePrint = useCallback(() => {
    if (printLayoutImage) {
      printImage(printLayoutImage, selectedLayout);
    }
  }, [printLayoutImage, printImage, selectedLayout]);

  // Clear and start over
  const handleClear = useCallback(() => {
    clearAll();
    setPrintLayoutImage(null);
    setActiveTab('capture');
    stopCamera();
    toast.success('Cleared!');
  }, [clearAll, stopCamera]);

  // Group sizes by country
  const sizesByCountry = PHOTO_SIZES.reduce((acc, size) => {
    if (!acc[size.country]) acc[size.country] = [];
    acc[size.country].push(size);
    return acc;
  }, {} as Record<string, typeof PHOTO_SIZES>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Camera className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Passport Photo Studio
              </h1>
              <p className="text-muted-foreground">
                Professional passport photos for all countries • Print-ready quality
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Photo Size Selection */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Photo Size
                </CardTitle>
                <CardDescription>Select the passport photo size you need</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedSize.id}
                  onValueChange={(id) => {
                    const size = PHOTO_SIZES.find(s => s.id === id);
                    if (size) setSelectedSize(size);
                  }}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {selectedSize.widthMM}×{selectedSize.heightMM}mm
                        </Badge>
                        <span>{selectedSize.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(sizesByCountry).map(([country, sizes]) => (
                      <div key={country}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                          {country}
                        </div>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {size.widthMM}×{size.heightMM}
                              </Badge>
                              <span>{size.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedSize.notes && (
                  <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1">
                    <Sparkles className="h-3 w-3 mt-0.5 text-primary" />
                    {selectedSize.notes}
                  </p>
                )}

                {/* Size Info */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-muted-foreground text-xs">Dimensions</div>
                    <div className="font-medium">{selectedSize.widthPx} × {selectedSize.heightPx}px</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-muted-foreground text-xs">Resolution</div>
                    <div className="font-medium">{selectedSize.dpi} DPI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adjustments */}
            <AnimatePresence>
              {sourceImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-border/50 shadow-lg overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Contrast className="h-5 w-5 text-primary" />
                          Adjustments
                        </span>
                        <Button variant="ghost" size="sm" onClick={resetAdjustments}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Brightness */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            <Sun className="h-4 w-4 text-amber-500" />
                            Brightness
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {adjustments.brightness}%
                          </span>
                        </div>
                        <Slider
                          value={[adjustments.brightness]}
                          onValueChange={([v]) => setAdjustments({ ...adjustments, brightness: v })}
                          min={50}
                          max={150}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Contrast */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            <Contrast className="h-4 w-4 text-blue-500" />
                            Contrast
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {adjustments.contrast}%
                          </span>
                        </div>
                        <Slider
                          value={[adjustments.contrast]}
                          onValueChange={([v]) => setAdjustments({ ...adjustments, contrast: v })}
                          min={50}
                          max={150}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Saturation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            <Droplets className="h-4 w-4 text-purple-500" />
                            Saturation
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {adjustments.saturation}%
                          </span>
                        </div>
                        <Slider
                          value={[adjustments.saturation]}
                          onValueChange={([v]) => setAdjustments({ ...adjustments, saturation: v })}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <Separator />

                      {/* Rotation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            <RotateCw className="h-4 w-4 text-green-500" />
                            Rotation
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {adjustments.rotation}°
                          </span>
                        </div>
                        <Slider
                          value={[adjustments.rotation]}
                          onValueChange={([v]) => setAdjustments({ ...adjustments, rotation: v })}
                          min={-180}
                          max={180}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Scale */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            <ZoomIn className="h-4 w-4 text-cyan-500" />
                            Scale
                          </Label>
                          <span className="text-xs font-mono text-muted-foreground">
                            {(adjustments.scale * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Slider
                          value={[adjustments.scale]}
                          onValueChange={([v]) => setAdjustments({ ...adjustments, scale: v })}
                          min={0.5}
                          max={2}
                          step={0.01}
                          className="w-full"
                        />
                      </div>

                      {/* Position */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Move className="h-4 w-4 text-rose-500" />
                          Position
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">X Offset</Label>
                            <Slider
                              value={[adjustments.offsetX]}
                              onValueChange={([v]) => setAdjustments({ ...adjustments, offsetX: v })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Y Offset</Label>
                            <Slider
                              value={[adjustments.offsetY]}
                              onValueChange={([v]) => setAdjustments({ ...adjustments, offsetY: v })}
                              min={-200}
                              max={200}
                              step={1}
                              className="w-full mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleApply} 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Apply Adjustments
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Print Layout Selection */}
            <AnimatePresence>
              {croppedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-border/50 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Grid className="h-5 w-5 text-primary" />
                        Print Layout
                      </CardTitle>
                      <CardDescription>
                        Choose paper size and layout
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Paper size indicator */}
                      <div className="flex gap-2 mb-2">
                        <Badge 
                          variant={selectedLayout.paperWidthInch === 4 ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const layout4x6 = PRINT_LAYOUTS.find(l => l.id.startsWith('4x6'));
                            if (layout4x6) setSelectedLayout(layout4x6);
                          }}
                        >
                          4×6 inch
                        </Badge>
                        <Badge 
                          variant={selectedLayout.paperWidthInch === 5 ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const layout5x7 = PRINT_LAYOUTS.find(l => l.id.startsWith('5x7'));
                            if (layout5x7) setSelectedLayout(layout5x7);
                          }}
                        >
                          5×7 Maxi
                        </Badge>
                      </div>

                      <Select
                        value={selectedLayout.id}
                        onValueChange={(id) => {
                          const layout = PRINT_LAYOUTS.find(l => l.id === id);
                          if (layout) setSelectedLayout(layout);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                            4×6 inch Paper
                          </div>
                          {PRINT_LAYOUTS.filter(l => l.paperWidthInch === 4).map((layout) => (
                            <SelectItem key={layout.id} value={layout.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {layout.columns}×{layout.rows}
                                </Badge>
                                <span>{layout.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">
                            5×7 Maxi Paper
                          </div>
                          {PRINT_LAYOUTS.filter(l => l.paperWidthInch === 5).map((layout) => (
                            <SelectItem key={layout.id} value={layout.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {layout.columns}×{layout.rows}
                                </Badge>
                                <span>{layout.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="text-sm text-muted-foreground">
                        This will create <strong>{selectedLayout.columns * selectedLayout.rows} photos</strong> on a {selectedLayout.paperWidthInch}×{selectedLayout.paperHeightInch} inch sheet
                      </div>

                      <Button 
                        onClick={handleGeneratePrint} 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Generating...' : 'Generate Print Layout'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Preview Area */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-xl h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <TabsList className="grid grid-cols-3 w-auto">
                      <TabsTrigger value="capture" className="px-4">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture
                      </TabsTrigger>
                      <TabsTrigger value="adjust" disabled={!sourceImage} className="px-4">
                        <Contrast className="h-4 w-4 mr-2" />
                        Adjust
                      </TabsTrigger>
                      <TabsTrigger value="print" disabled={!printLayoutImage} className="px-4">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </TabsTrigger>
                    </TabsList>
                    
                    {sourceImage && (
                      <Button variant="ghost" size="sm" onClick={handleClear}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Capture Tab */}
                  <TabsContent value="capture" className="mt-0">
                    <div className="relative aspect-[4/3] bg-muted/30 rounded-2xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay guide */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div 
                              className="border-2 border-white/50 rounded-lg shadow-lg"
                              style={{
                                width: `${selectedSize.widthMM * 2}px`,
                                height: `${selectedSize.heightMM * 2}px`,
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-20 border border-white/30 rounded-full -mt-6" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                            <Button
                              size="lg"
                              onClick={capturePhoto}
                              className="rounded-full h-16 w-16 shadow-xl"
                            >
                              <Camera className="h-6 w-6" />
                            </Button>
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={stopCamera}
                              className="rounded-full h-16 w-16"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                            <Camera className="h-10 w-10 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Capture or Upload Photo</h3>
                          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            Use your camera to take a photo, upload from your device, or paste from clipboard
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <Button size="lg" onClick={startCamera}>
                              <Camera className="h-5 w-5 mr-2" />
                              Open Camera
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              Upload Photo
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={handlePaste}
                            >
                              <ImageIcon className="h-5 w-5 mr-2" />
                              Paste Image
                            </Button>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Adjust Tab */}
                  <TabsContent value="adjust" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Original Image */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Original</h4>
                        <div 
                          className="relative bg-muted/30 rounded-xl overflow-hidden border"
                          style={{ aspectRatio: `${selectedSize.widthMM}/${selectedSize.heightMM}` }}
                        >
                          {sourceImage && (
                            <img
                              src={sourceImage}
                              alt="Original"
                              className="w-full h-full object-cover"
                              style={{
                                filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
                                transform: `rotate(${adjustments.rotation}deg) scale(${adjustments.scale}) translate(${adjustments.offsetX}px, ${adjustments.offsetY}px)`,
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                          Preview ({selectedSize.widthMM}×{selectedSize.heightMM}mm)
                        </h4>
                        <div 
                          className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg"
                          style={{ 
                            aspectRatio: `${selectedSize.widthMM}/${selectedSize.heightMM}`,
                            backgroundColor: selectedSize.bgColor
                          }}
                        >
                          {croppedImage ? (
                            <img
                              src={croppedImage}
                              alt="Cropped"
                              className="w-full h-full object-cover"
                            />
                          ) : sourceImage ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-sm text-muted-foreground text-center px-4">
                                Click "Apply Adjustments" to generate preview
                              </p>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-sm text-muted-foreground">No image</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Size specs */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {selectedSize.widthPx}×{selectedSize.heightPx}px
                          </Badge>
                          <Badge variant="secondary">
                            {selectedSize.dpi} DPI
                          </Badge>
                          <Badge variant="outline">
                            {selectedSize.country}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Print Tab */}
                  <TabsContent value="print" className="mt-0">
                    {printLayoutImage ? (
                      <div className="space-y-6">
                        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden mx-auto" style={{ maxWidth: '500px' }}>
                          <img
                            src={printLayoutImage}
                            alt="Print Layout"
                            className="w-full h-auto"
                          />
                          {/* Paper size indicator */}
                          <div className="absolute bottom-2 right-2">
                            <Badge className="bg-black/70 text-white">
                              {selectedLayout.paperWidthInch}×{selectedLayout.paperHeightInch} inch • 300 DPI
                            </Badge>
                          </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                          {selectedLayout.columns * selectedLayout.rows} photos of {selectedSize.name} on {selectedLayout.paperWidthInch}×{selectedLayout.paperHeightInch} inch paper
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                          <Button size="lg" onClick={handleDownload}>
                            <Download className="h-5 w-5 mr-2" />
                            Download Image
                          </Button>
                          <Button size="lg" variant="outline" onClick={handlePrint}>
                            <Printer className="h-5 w-5 mr-2" />
                            Print Now
                          </Button>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4 text-sm">
                          <h4 className="font-medium mb-2">Print Tips:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Use glossy photo paper for best results</li>
                            <li>Set printer to "Actual Size" or "100%" scale</li>
                            <li>Select "Best" or "Photo" quality in printer settings</li>
                            <li>Cut along the light gray lines for perfect sizing</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Generate a print layout from the adjusted photo</p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
