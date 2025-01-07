import PropTypes from 'prop-types';
import DocFileIcon from './DocFileIcon';
import PdfFileIcon from './PdfFileIcon';
import ExelFileIcon from './ExelFileIcon';
import UnknownFileIcon from './UnknownFileIcon';
import CSVFileIcon from './CSVFileIcon';
import EDMFileIcon from './EDMFileIcon';
import ImageFileIcon from './ImageFileIcon';

const FileIcon = ({ name, ...rest }) => {
  const acceptedImagesTypes = ['jpg', 'png', 'jpeg'];
  const nameArray = name.split('.');
  const fileType = nameArray.pop();

  if (fileType.includes('doc')) return <DocFileIcon {...rest} />;
  if (fileType.includes('pdf')) return <PdfFileIcon {...rest} />;
  if (fileType.includes('xls')) return <ExelFileIcon {...rest} />;
  if (fileType.includes('csv')) return <CSVFileIcon {...rest} />;
  if (fileType.includes('xml') && nameArray.pop() === 'edm') return <EDMFileIcon {...rest} />;
  if (acceptedImagesTypes.includes(fileType)) return <ImageFileIcon {...rest} />;
  return <UnknownFileIcon {...rest} />;
};
FileIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FileIcon;
