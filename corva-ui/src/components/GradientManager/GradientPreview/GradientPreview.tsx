import { makeStyles } from '@material-ui/core';
import tinygradient from 'tinygradient';
import type { GradientFillStop } from '~/types';

interface GradientPreviewProps {
  gradientStops: GradientFillStop[];
}

const useStyles = makeStyles({
  gradientPreview: {
    background: 'red',
    width: 32,
    height: 16,
    borderRadius: 4,
  },
});

export const GradientPreview: React.FC<GradientPreviewProps> = ({ gradientStops }) => {
  const linearGradient = tinygradient(
    gradientStops.map(item => ({
      color: item.color,
      pos: item.pos / 100,
    }))
  ).css('linear', '90deg');

  const styles = useStyles();
  return <div className={styles.gradientPreview} style={{ background: linearGradient }} />;
};
