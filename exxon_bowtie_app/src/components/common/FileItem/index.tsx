import { FC, useMemo } from 'react';
import moment from 'moment';

import fileIcon from '../../../assets/file.svg';
import csvIcon from '../../../assets/csv.svg';
import docIcon from '../../../assets/doc.svg';
import excelIcon from '../../../assets/excel.svg';
import pdfIcon from '../../../assets/pdf.svg';
import pptxIcon from '../../../assets/pptx.svg';
import pictureIcon from '../../../assets/picture.svg';
import txtIcon from '../../../assets/txt.svg';

import styles from './index.module.css';

import { getRecordType, Record, RECORD_TYPE } from '@/entities/record';

type Props = {
  item: Record;
  onClick?: () => void;
  testId?: string;
};

export const FileItem: FC<Props> = ({ item, testId, onClick }) => {
  const iconSrc = useMemo(() => {
    const type = getRecordType(item);
    switch (type) {
      case RECORD_TYPE.CSV:
        return csvIcon;
      case RECORD_TYPE.PPT:
        return pptxIcon;
      case RECORD_TYPE.PDF:
        return pdfIcon;
      case RECORD_TYPE.DOCS:
        return docIcon;
      case RECORD_TYPE.TEXT:
        return txtIcon;
      case RECORD_TYPE.IMAGE:
        return pictureIcon;
      case RECORD_TYPE.XLSX:
        return excelIcon;
      default:
        return fileIcon;
    }
  }, [item]);

  const getDateFromStr = (datetime: string): moment.Moment => {
    return moment(datetime);
  };

  return (
    <div className={styles.container} data-testid={testId} onClick={onClick}>
      <img className={styles.icon} src={iconSrc} alt="File icon" />
      <div className={styles.data}>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.date}>{getDateFromStr(item.datetime).format('DD/MM/YY, HH:mm')}</p>
      </div>
    </div>
  );
};
