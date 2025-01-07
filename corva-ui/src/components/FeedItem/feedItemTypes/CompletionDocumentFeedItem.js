import PropTypes from 'prop-types';

import Attachment from '~/components/Attachment';

const CompletionDocumentFeedItem = ({
  feedItem: {
    context: {
      completion_document: {
        data: { display_name: displayName, file_name: fileName, size, signed_url: signedUrl },
      },
    },
  },
}) => {
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

CompletionDocumentFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      completion_document: PropTypes.shape({
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

export default CompletionDocumentFeedItem;
