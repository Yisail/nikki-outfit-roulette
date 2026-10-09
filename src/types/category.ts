export interface CategoryOption { id: string; label: string; swatch?: string }
export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultDrawCount: number;
  minDrawCount: number;
  maxDrawCount: number;
  drawCountLabels?: Record<number, string>;
  allowDuplicates: boolean;
  preserveModeResults?: boolean;
  allowIndividualRedraw?: boolean;
  options: CategoryOption[];
}
