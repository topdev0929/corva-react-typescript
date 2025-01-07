import { observer } from 'mobx-react-lite';

import { isImage, isVideo } from '@/entities/record';
import { useInsightFormStore } from '@/contexts/insight-form';
import { AsyncPhoto } from '@/shared/components/AsyncPhoto';
import { FileItem } from '@/shared/components/FileItem';
import { FilePreview } from '@/shared/components/FilePreview';
import { VideoItem } from '@/shared/components/VideoItem';
import { VIEWS } from '@/constants';

import styles from './index.module.css';

export const FilesPreview = observer(() => {
  const store = useInsightFormStore();

  const renderContent = file => {
    if (isVideo(file)) {
      return <VideoItem item={file} onUpload={() => store.getPhotoLink(file)} />;
    }

    return isImage(file) && !isVideo(file) ? (
      <AsyncPhoto onUpload={() => store.getPhotoLink(file)} />
    ) : (
      <FileItem item={file} />
    );
  };

  return (
    <div className={styles.container}>
      {store.files.map(file => {
        const testId = `${VIEWS.INSIGHT_FORM}_filePreview_${file.name}`;
        return (
          <FilePreview key={file.id} onDelete={() => store.removeFile(file.id)} testId={testId}>
            {renderContent(file)}
          </FilePreview>
        );
      })}
    </div>
  );
});
