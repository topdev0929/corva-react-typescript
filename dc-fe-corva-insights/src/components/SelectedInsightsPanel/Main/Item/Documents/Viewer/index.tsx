import { FC, useState } from 'react';

import { Record } from '@/entities/record';
import { FileViewer } from '@/shared/components/FileViewer';

type Props = {
  onClose: () => void;
  onGetFileLink: (ref: string) => Promise<string>;
  defaultIndex: number;
  records: Record[];
  testId?: string;
};

export const SelectedDayDocumentsViewer: FC<Props> = ({
  records,
  defaultIndex,
  onClose,
  onGetFileLink,
  testId,
}) => {
  const [currentRecord, setCurrentRecord] = useState<Record>(records[defaultIndex]);
  const [currentRecordLink, setCurrentRecordLink] = useState<string>('');

  const loadRecordLink = async (record: Record) => {
    const recordLink = await onGetFileLink(record.ref);
    setCurrentRecordLink(recordLink);
  };

  const onChangeRecord = (record: Record) => {
    setCurrentRecord(record);
    loadRecordLink(record);
  };

  return (
    <FileViewer
      open
      fileUrl={currentRecordLink}
      fileName={currentRecord.name}
      onClose={onClose}
      data-testid={`${testId}_fileViewer`}
    >
      <FileViewer.Slider<Record>
        items={records}
        defaultIndex={defaultIndex}
        onChange={onChangeRecord}
        data-testid={`${testId}_fileViewer_slider`}
      >
        {currentRecordLink ? (
          <FileViewer.DocViewer
            fileUrl={currentRecordLink}
            fileName={currentRecord.name}
            data-testid={`${testId}_fileViewer_doc`}
          />
        ) : null}
      </FileViewer.Slider>
    </FileViewer>
  );
};
