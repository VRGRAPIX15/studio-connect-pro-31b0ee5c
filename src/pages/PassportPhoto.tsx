import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Download, 
  Printer, 
  RotateCcw, 
  ZoomIn, 
  Sun,
  Contrast,
  Droplets,
  RotateCw,
  Move,
  Grid,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { usePassportPhoto } from '@/hooks/usePassportPhoto';
import { PHOTO_SIZES, calculateOptimalLayout, PRINT_LAYOUTS } from '@/types/passport';

export default function PassportPhoto() {
  const {
    sourceImage,
    croppedImage,
    selectedSize,
    selectedLayout,
    adjustments,
    isProcessing,
    numberOfCopies,
    setSelectedSize,
    setSelectedLayout,
    setAdjustments,
    setNumberOfCopies,
    loadImage,
    loadImageFromUrl,
    resetAdjustments,
    applyAdjustments,
    generatePrintLayout,
    downloadImage,
    printImage,
    clearAll,
    getLayoutInfo,
  } = usePassportPhoto();

  const [activeTab, setActiveTab] = useState('capture');
  const [printLayoutImage, setPrintLayoutImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get layout info for current photo size
  const layoutInfo = useMemo(() => {
    return calculateOptimalLayout(selectedSize, selectedLayout);
  }, [selectedSize, selectedLayout]);

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
                Professional passport photos for all countries • 4×6 inch print
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

                {/* Layout Info */}
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">On 4×6 paper:</span>
                    <Badge variant="secondary" className="font-semibold">
                      {layoutInfo.photoCount} photos max
                    </Badge>
                  </div>
                  {layoutInfo.rotated && (
                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                      <RotateCw className="h-3 w-3" />
                      Photos will be auto-rotated for best fit
                    </p>
                  )}
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
                        4×6 inch paper • Auto-fit with rotation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Number of copies */}
                      <div className="space-y-2">
                        <Label className="text-sm">Number of Photos</Label>
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setNumberOfCopies(Math.max(1, numberOfCopies - 1))}
                            disabled={numberOfCopies <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={numberOfCopies}
                            onChange={(e) => setNumberOfCopies(Math.max(1, Math.min(layoutInfo.photoCount, parseInt(e.target.value) || 1)))}
                            className="w-20 text-center"
                            min={1}
                            max={layoutInfo.photoCount}
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setNumberOfCopies(Math.min(layoutInfo.photoCount, numberOfCopies + 1))}
                            disabled={numberOfCopies >= layoutInfo.photoCount}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setNumberOfCopies(layoutInfo.photoCount)}
                          >
                            Fill ({layoutInfo.photoCount})
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Paper size:</span>
                          <span className="font-medium">4×6 inch</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Layout:</span>
                          <span className="font-medium">{layoutInfo.columns} × {layoutInfo.rows} grid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max photos:</span>
                          <span className="font-medium">{layoutInfo.photoCount}</span>
                        </div>
                        {layoutInfo.rotated && (
                          <div className="flex justify-between text-primary">
                            <span>Auto-rotated:</span>
                            <span className="font-medium">Yes (90°)</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={handleGeneratePrint} 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Generating...' : `Generate ${numberOfCopies} Photo${numberOfCopies > 1 ? 's' : ''}`}
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
                    <div className="space-y-6">
                      {isCameraActive ? (
                        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Camera overlay guide */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div 
                              className="border-2 border-dashed border-white/50 rounded-lg"
                              style={{
                                width: '40%',
                                aspectRatio: `${selectedSize.widthMM}/${selectedSize.heightMM}`
                              }}
                            />
                          </div>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                            <Button size="lg" onClick={capturePhoto}>
                              <Camera className="h-5 w-5 mr-2" />
                              Capture
                            </Button>
                            <Button size="lg" variant="outline" onClick={stopCamera}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/20">
                            <Camera className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Get Started</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Take a photo using your camera, upload an existing photo, or paste from clipboard
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                              <Button size="lg" onClick={startCamera}>
                                <Camera className="h-5 w-5 mr-2" />
                                Use Camera
                              </Button>
                              <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-5 w-5 mr-2" />
                                Upload Photo
                              </Button>
                              <Button size="lg" variant="outline" onClick={handlePaste}>
                                <ImageIcon className="h-5 w-5 mr-2" />
                                Paste
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

                          <div className="bg-muted/30 rounded-lg p-4 text-sm">
                            <h4 className="font-medium mb-2">Tips for a perfect passport photo:</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>Use a plain white or light-colored background</li>
                              <li>Face the camera directly with a neutral expression</li>
                              <li>Ensure good, even lighting with no shadows</li>
                              <li>Keep your head straight and centered</li>
                              <li>Remove glasses (unless required for medical reasons)</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Adjust Tab */}
                  <TabsContent value="adjust" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Original</Label>
                          <div className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden">
                            {sourceImage && (
                              <img
                                src={sourceImage}
                                alt="Original"
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Preview */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">
                            Preview ({selectedSize.widthMM}×{selectedSize.heightMM}mm)
                          </Label>
                          <div 
                            className="relative bg-muted rounded-xl overflow-hidden flex items-center justify-center p-4"
                            style={{ aspectRatio: '3/4' }}
                          >
                            {croppedImage ? (
                              <img
                                src={croppedImage}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain shadow-lg"
                                style={{
                                  aspectRatio: `${selectedSize.widthMM}/${selectedSize.heightMM}`
                                }}
                              />
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <p>Click "Apply Adjustments" to preview</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Selected size info */}
                      <div className="flex items-center gap-4 justify-center">
                        <Badge variant="secondary" className="text-sm py-1.5 px-4">
                          {selectedSize.name}
                        </Badge>
                        <Badge variant="outline" className="text-sm py-1.5 px-4 font-mono">
                          {selectedSize.widthMM}×{selectedSize.heightMM}mm
                        </Badge>
                        <Badge variant="outline">
                          {selectedSize.country}
                        </Badge>
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
                              4×6 inch • 300 DPI
                            </Badge>
                          </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                          {numberOfCopies} photo{numberOfCopies > 1 ? 's' : ''} of {selectedSize.name} on 4×6 inch paper
                          {layoutInfo.rotated && ' (auto-rotated for best fit)'}
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