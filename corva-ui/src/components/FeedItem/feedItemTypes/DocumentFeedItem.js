import PropTypes from 'prop-types';

import Attachment from '~/components/Attachment';

const DocumentFeedItem = props => {
  const {
    feedItem: {
      context: {
        document: {
          data: { display_name: displayName, file_name: fileName, size, signed_url: signedUrl },
        },
      },
    },
  } = props;
  const attachmentProps = signedUrl ? { attachmentUrl: signedUrl } : { fileName };
  return (
    <Attachment
      {...attachmentProps}
      attachmentSize={size}
      displayName={displayName}
      size="medium"
    />
  );
};

DocumentFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      document: PropTypes.shape({
        data: PropTypes.shape({
          display_name: PropTypes.string.isRequired,
          file_name: PropTypes.string.isRequired,
          size: PropTypes.number,
          signed_url: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default DocumentFeedItem;
