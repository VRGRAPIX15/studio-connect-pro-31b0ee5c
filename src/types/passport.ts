// Passport Photo Types - Re-export from country templates
import { COUNTRY_TEMPLATES, CountryTemplate } from '@/data/countryTemplates';

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
  autoFit: boolean;
}

// Convert country templates to photo sizes
export const PHOTO_SIZES: PhotoSize[] = COUNTRY_TEMPLATES.map(t => ({
  id: t.id,
  name: t.name,
  country: t.country,
  widthMM: t.widthMM,
  heightMM: t.heightMM,
  widthPx: t.widthPx,
  heightPx: t.heightPx,
  dpi: t.dpi,
  bgColor: t.bgColor,
  notes: t.notes,
}));

// Print layouts
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
  {
    id: 'a4_auto',
    name: 'A4 Paper (Auto-fit)',
    paperWidthInch: 8.27,
    paperHeightInch: 11.69,
    marginMM: 5,
    gapMM: 3,
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

// Re-export for convenience
export { COUNTRY_TEMPLATES, type CountryTemplate } from '@/data/countryTemplates';
export { BACKGROUND_COLORS, getPopularTemplates, searchTemplates, getTemplatesByCountry } from '@/data/countryTemplates';