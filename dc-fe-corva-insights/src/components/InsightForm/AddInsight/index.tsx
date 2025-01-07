import { observer } from 'mobx-react-lite';

import { InsightFormProvider } from '@/contexts/insight-form';
import { useGlobalStore } from '@/contexts/global';

import { InsightForm } from '../index';

export const AddInsight = observer(() => {
  const globalStore = useGlobalStore();

  if (!globalStore.isAddInsightFormOpen) return null;

  return (
    <InsightFormProvider editedInsight={null}>
      <InsightForm open onClose={() => globalStore.closeAddInsightForm()} />
    </InsightFormProvider>
  );
});

AddInsight.displayName = 'AddInsight';
