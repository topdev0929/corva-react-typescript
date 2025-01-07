import { GradientFillStop } from './GradientFillStop';

export type CustomGradient = {
  name: string;
  id: string;
  gradientStops: GradientFillStop[];
};
