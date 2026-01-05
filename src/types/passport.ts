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
  columns: number;
  rows: number;
  marginMM: number;
  gapMM: number;
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

// Print layouts for different paper sizes
export const PRINT_LAYOUTS: PrintLayout[] = [
  // 4x6 inch layouts
  {
    id: '4x6_india_passport',
    name: '4x6 - Indian Passport (8 photos)',
    paperWidthInch: 4,
    paperHeightInch: 6,
    columns: 2,
    rows: 4,
    marginMM: 3,
    gapMM: 2,
  },
  {
    id: '4x6_us_passport',
    name: '4x6 - US Passport (4 photos)',
    paperWidthInch: 4,
    paperHeightInch: 6,
    columns: 2,
    rows: 2,
    marginMM: 5,
    gapMM: 3,
  },
  {
    id: '4x6_stamp',
    name: '4x6 - Stamp Size (20 photos)',
    paperWidthInch: 4,
    paperHeightInch: 6,
    columns: 4,
    rows: 5,
    marginMM: 3,
    gapMM: 2,
  },
  {
    id: '4x6_mixed',
    name: '4x6 - Custom Layout',
    paperWidthInch: 4,
    paperHeightInch: 6,
    columns: 2,
    rows: 3,
    marginMM: 5,
    gapMM: 3,
  },
  // 5x7 inch (Maxi Size) layouts
  {
    id: '5x7_india_passport',
    name: '5x7 Maxi - Indian Passport (12 photos)',
    paperWidthInch: 5,
    paperHeightInch: 7,
    columns: 3,
    rows: 4,
    marginMM: 4,
    gapMM: 2,
  },
  {
    id: '5x7_us_passport',
    name: '5x7 Maxi - US Passport (6 photos)',
    paperWidthInch: 5,
    paperHeightInch: 7,
    columns: 2,
    rows: 3,
    marginMM: 5,
    gapMM: 3,
  },
  {
    id: '5x7_stamp',
    name: '5x7 Maxi - Stamp Size (35 photos)',
    paperWidthInch: 5,
    paperHeightInch: 7,
    columns: 5,
    rows: 7,
    marginMM: 3,
    gapMM: 2,
  },
  {
    id: '5x7_pan_aadhaar',
    name: '5x7 Maxi - PAN/Aadhaar (15 photos)',
    paperWidthInch: 5,
    paperHeightInch: 7,
    columns: 3,
    rows: 5,
    marginMM: 4,
    gapMM: 2,
  },
  {
    id: '5x7_mixed',
    name: '5x7 Maxi - Custom Layout',
    paperWidthInch: 5,
    paperHeightInch: 7,
    columns: 3,
    rows: 4,
    marginMM: 5,
    gapMM: 3,
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
