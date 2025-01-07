import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { EditableItem as EditableItemComponent } from '~/components/EditableItem';

export const EditableItemWithState = props => {
  const [value, setValue] = useState('Task Apps');

  return <EditableItemComponent value={value} onSave={setValue} {...props} />;
};

export const EditableItem = props => {
  return (
    <div style={{ width: 241, backgroundColor: '#464646' }}>
      <EditableItemWithState {...props} />
      <EditableItemWithState {...props} />
      <EditableItemWithState {...props} />
    </div>
  );
};

export default {
  title: 'Components/EditableItem',
  component: EditableItemComponent,
  excludeStories: ['EditableItemWithState'],
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/EditableItem/EditableItem/index.js',
  },
};
