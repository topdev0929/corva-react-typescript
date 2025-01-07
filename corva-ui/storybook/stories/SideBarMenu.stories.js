import { useState } from 'react';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import FolderMenuItemWithLinks from '~/components/FolderMenuItemWithLinks';

const frontendItems = [
  { id: 'fe0', title: 'Components Library', isEditable: true, url: 'fe0' },
  { id: 'fe1', title: 'Sample Apps', isEditable: true, url: 'fe1' },
];

const backendItems = [
  { id: 'be0', title: 'Task Apps', isEditable: true, url: 'be0' },
  { id: 'be1', title: 'Real Time Apps', isEditable: true, url: 'be1' },
  { id: 'be2', title: 'Polling Apps', isEditable: true, url: 'be2' },
  { id: 'be3', title: 'Custom Page', isEditable: true, url: 'be3' },
];

const datasetsItems = [];

// export const Default = props => <FolderMenuItemWithLinks {...props} />;

export const SideBarMenu = () => {
  const [selectedItemId, setSelectedItem] = useState(null);

  const handleAddItem = folderId => {
    // TODO: open page with new item
    // eslint-disable-next-lint no-alert
    window.alert(`Page was added to ${folderId} folder`);
  };

  const handleClick = ({ id, url }) => {
    setSelectedItem(id);
    // TODO: open page here
    window.alert(id, url);
    // history.push(makePageUrl(url));
  };

  const handleSave = ({ id, title }) => {
    // TODO: update item here
    // eslint-disable-next-lint no-alert
    window.alert(`Page title of ${id} was updated with ${title}`);
  };

  return (
    <nav style={{ width: 241, backgroundColor: '#464646' }}>
      <FolderMenuItemWithLinks
        folderColor="#DB50E7"
        id="frontend"
        isCreatable
        items={frontendItems}
        key="frontend"
        name="Frontend"
        onAdd={handleAddItem}
        onClick={handleClick}
        onSave={handleSave}
        selectedItemId={selectedItemId}
      />
      <FolderMenuItemWithLinks
        folderColor="#5382FA"
        id="backend"
        isCreatable
        items={backendItems}
        key="backend"
        name="Backend"
        onAdd={handleAddItem}
        onClick={handleClick}
        onSave={handleSave}
        selectedItemId={selectedItemId}
      />
      <FolderMenuItemWithLinks
        folderColor="#EF7D7D"
        id="datasets"
        isCreatable={false}
        items={datasetsItems}
        key="datasets"
        name="Datasets"
        onAdd={handleAddItem}
        onClick={handleClick}
        onSave={handleSave}
        selectedItemId={selectedItemId}
      />
    </nav>
  );
};

export default {
  title: 'Components/EditableItem',
  component: FolderMenuItemWithLinks,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/FolderMenuItemWithLinks/index.js',
  },
};
