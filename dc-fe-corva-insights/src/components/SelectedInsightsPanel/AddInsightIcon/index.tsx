import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';
import { getUserFullName } from '@/shared/utils';
import { CommentIcon } from '@/shared/components/CommentIcon';

export const AddInsightIcon = observer(() => {
  const globalStore = useGlobalStore();

  return (
    <CommentIcon
      onClick={() => globalStore.openAddInsightForm()}
      displayName={getUserFullName(globalStore.user)}
      imgSrc={globalStore.user.profilePhoto}
    />
  );
});

AddInsightIcon.displayName = 'AddInsightIcon';
