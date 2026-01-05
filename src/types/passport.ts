// Passport Photo Types

export interface PhotoSize {
  id: string;
  name: string;
  country: string;
  widthMM: number;
  heightMM: number;
  widthPx: number;
  heightPx: number;
  dpi: number;
  bgColor: string;
  notes?: string;
}

export interface PhotoAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface PrintLayout {
  id: string;
  name: string;
  paperWidthInch: number;
  paperHeightInch: number;
  marginMM: number;
  gapMM: number;
  // Auto-calculated based on photo size
  autoFit: boolean;
}

// Standard passport photo sizes (all at 300 DPI for print quality)
export const PHOTO_SIZES: PhotoSize[] = [
  {
    id: 'india_passport',
    name: 'Indian Passport',
    country: 'India',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#FFFFFF',
    notes: '80% face coverage, white background'
  },
  {
    id: 'india_visa',
    name: 'Indian Visa',
    country: 'India',
    widthMM: 51,
    heightMM: 51,
    widthPx: 602,
    heightPx: 602,
    dpi: 300,
    bgColor: '#FFFFFF',
    notes: 'Square format, white background'
  },
  {
    id: 'india_aadhaar',
    name: 'Aadhaar Card',
    country: 'India',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'india_pan',
    name: 'PAN Card',
    country: 'India',
    widthMM: 25,
    heightMM: 35,
    widthPx: 295,
    heightPx: 413,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'us_passport',
    name: 'US Passport',
    country: 'USA',
    widthMM: 51,
    heightMM: 51,
    widthPx: 600,
    heightPx: 600,
    dpi: 300,
    bgColor: '#FFFFFF',
    notes: '2x2 inches, white/off-white background'
  },
  {
    id: 'us_visa',
    name: 'US Visa',
    country: 'USA',
    widthMM: 51,
    heightMM: 51,
    widthPx: 600,
    heightPx: 600,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'uk_passport',
    name: 'UK Passport',
    country: 'UK',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#F5F5F5',
    notes: 'Light grey or cream background'
  },
  {
    id: 'schengen_visa',
    name: 'Schengen Visa',
    country: 'Europe',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#E8E8E8',
    notes: 'Light grey background'
  },
  {
    id: 'canada_passport',
    name: 'Canada Passport',
    country: 'Canada',
    widthMM: 50,
    heightMM: 70,
    widthPx: 590,
    heightPx: 826,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'australia_passport',
    name: 'Australia Passport',
    country: 'Australia',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'japan_passport',
    name: 'Japan Passport',
    country: 'Japan',
    widthMM: 35,
    heightMM: 45,
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'china_visa',
    name: 'China Visa',
    country: 'China',
    widthMM: 33,
    heightMM: 48,
    widthPx: 390,
    heightPx: 567,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
  {
    id: 'stamp_size',
    name: 'Stamp Size',
    country: 'India',
    widthMM: 20,
    heightMM: 25,
    widthPx: 236,
    heightPx: 295,
    dpi: 300,
    bgColor: '#FFFFFF',
  },
];

// Print layout for 4x6 inch paper only - auto-fit with rotation
export const PRINT_LAYOUTS: PrintLayout[] = [
  {
    id: '4x6_auto',
    name: '4×6 inch (Auto-fit)',
    paperWidthInch: 4,
    paperHeightInch: 6,
    marginMM: 3,
    gapMM: 2,
    autoFit: true,
  },
];

export const defaultAdjustments: PhotoAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

// Calculate optimal grid layout for a photo size on paper
export function calculateOptimalLayout(
  photoSize: PhotoSize,
  layout: PrintLayout
): { columns: number; rows: number; rotated: boolean; photoCount: number } {
  const DPI = 300;
  const paperWidthMM = layout.paperWidthInch * 25.4;
  const paperHeightMM = layout.paperHeightInch * 25.4;
  
  const availableWidth = paperWidthMM - (layout.marginMM * 2);
  const availableHeight = paperHeightMM - (layout.marginMM * 2);
  
  // Try normal orientation
  const normalCols = Math.floor((availableWidth + layout.gapMM) / (photoSize.widthMM + layout.gapMM));
  const normalRows = Math.floor((availableHeight + layout.gapMM) / (photoSize.heightMM + layout.gapMM));
  const normalCount = normalCols * normalRows;
  
  // Try rotated orientation (swap photo width/height)
  const rotatedCols = Math.floor((availableWidth + layout.gapMM) / (photoSize.heightMM + layout.gapMM));
  const rotatedRows = Math.floor((availableHeight + layout.gapMM) / (photoSize.widthMM + layout.gapMM));
  const rotatedCount = rotatedCols * rotatedRows;
  
  // Use whichever orientation fits more photos
  if (rotatedCount > normalCount) {
    return { columns: rotatedCols, rows: rotatedRows, rotated: true, photoCount: rotatedCount };
  }
  
  return { columns: normalCols, rows: normalRows, rotated: false, photoCount: normalCount };
}