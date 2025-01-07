/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import fileExtension from 'file-extension';
import imageExtensions from 'image-extensions';

const fileExtensions = {
  image: imageExtensions,
  doc: ['doc', 'docx'],
  xls: ['xls', 'xlsx'],
  pdf: ['pdf'],
  archive: ['zip', 'rar', '7z', 'tar'],
};

const styles = {
  fileTypeWrapper: { display: 'inline-block', verticalAlign: 'top' },
};

const FileTypeIcon = ({ fileName, size, className }) => {
  const extension = fileExtension(fileName);

  let fileTypeIcon;

  if (fileExtensions.image.includes(extension)) {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/image.svg';
  } else if (fileExtensions.doc.includes(extension)) {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/doc.svg';
  } else if (fileExtensions.xls.includes(extension)) {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/xls.svg';
  } else if (fileExtensions.pdf.includes(extension)) {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/pdf.svg';
  } else if (fileExtensions.archive.includes(extension)) {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/archive.svg';
  } else {
    fileTypeIcon = 'https://cdn.corva.ai/app/images/file-type-icons/other.svg';
  }

  return (
    <div style={styles.fileTypeWrapper} className={className}>
      <img
        src={fileTypeIcon}
        alt="File icon"
        style={{
          display: 'block',
          height: size,
          width: size,
        }}
      />
    </div>
  );
};

FileTypeIcon.propTypes = {
  fileName: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

FileTypeIcon.defaultProps = {
  size: 50,
  className: undefined,
};

export default FileTypeIcon;
