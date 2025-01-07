import { GradientFillStop } from '~/types';

export interface GradientPickerComponentProps {
  from: number;
  to: number;
  unit: string;
  style?: object;
  gradientStops: GradientFillStop[];
  onChange: (gradientStops: GradientFillStop[]) => void;
  size?: {
    width: number;
  };
  readonly?: boolean;
  noScale?: boolean;
  isMoveInputVisible?: boolean;
  'data-testid'?: string;
}
