import { FC } from 'react';

import { Insight } from '@/entities/insight';
import { InsightFormProvider } from '@/contexts/insight-form';

import { InsightForm } from '../index';

type Props = {
  editedInsight: Insight | null;
  open: boolean;
  onClose: () => void;
};

export const EditInsight: FC<Props> = ({ editedInsight, open, onClose }) => {
  if (!open) return null;

  return (
    <InsightFormProvider editedInsight={editedInsight}>
      <InsightForm open onClose={onClose} />
    </InsightFormProvider>
  );
};
