import { FC, useState } from 'react';

import { Record } from '@/entities/record';
import { useDownloadFile } from '@/shared/hooks/useDownloadFIle';
import { useViewer } from '@/shared/hooks/useViewer';
import { FileItem } from '@/shared/components/FileItem';
import { ContextMenu } from '@/shared/components/ContextMenu';

import { SelectedDayDocumentsViewer } from './Viewer';
import styles from './index.module.css';

type Props = {
  documents: Record[];
  onGetFileLink: (ref: string) => Promise<string>;
  testId?: string;
};

type ContextMenuData = { x: number; y: number } & (
  | { isOpen: false; record: null }
  | { isOpen: true; record: Record }
);
const initialContextMenuData: ContextMenuData = {
  x: 0,
  y: 0,
  isOpen: false,
  record: null,
};

export const DocumentsList: FC<Props> = ({ documents, onGetFileLink, testId }) => {
  const downloadFile = useDownloadFile(onGetFileLink);
  const { viewerData, closeViewer, openViewer } = useViewer();

  const [contextMenuData, setContextMenuData] = useState<ContextMenuData>(initialContextMenuData);

  const closeContextMenu = () => setContextMenuData(initialContextMenuData);

  const onContextMenu = (event, record) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuData({
      x: event.clientX - 2,
      y: event.clientY - 4,
      isOpen: true,
      record,
    });
  };

  const onDownloadFile = async (record: Record) => {
    closeContextMenu();
    await downloadFile(record.ref);
  };

  return (
    <div className={styles.container}>
      {documents.map((doc, index) => {
        return (
          <div
            key={doc.id}
            className={styles.item}
            onContextMenu={event => onContextMenu(event, doc)}
          >
            <FileItem
              item={doc}
              testId={`${testId}_documents_${index}`}
              onClick={() => openViewer(index)}
            />
          </div>
        );
      })}
      {contextMenuData.isOpen && (
        <ContextMenu
          x={contextMenuData.x}
          y={contextMenuData.y}
          onClose={closeContextMenu}
          onDownloadFile={() => onDownloadFile(contextMenuData.record)}
          testId={`${testId}_documents_contextMenu`}
        />
      )}
      {viewerData.isOpen && (
        <SelectedDayDocumentsViewer
          onClose={closeViewer}
          onGetFileLink={onGetFileLink}
          defaultIndex={viewerData.defaultIndex}
          records={documents}
          testId={testId}
        />
      )}
    </div>
  );
};
