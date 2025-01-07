import PropTypes from 'prop-types';

import { FEED_ITEM_TYPES } from '~/constants/feed';
import utils from '~/utils/main';
import PostPreviewDialog from '~/components/PostPreviewDialog';
import TracesEditModal from '~/components/TracesEditModal';
import HookloadCommentEdit from '~/components/FeedItem/editModals/HookloadCommentEdit';

import DvDCommentEdit from '../editModals/DvdCommentEdit';
import PCCommentEdit from '../editModals/PCCommentEdit';
import NptLessonsCommentEdit from '../editModals/NptLessonsCommentEdit/NptLessonsCommentEdit';
import LessonsLearnedEdit from '../editModals/LessonsLearnedEdit/LessonsLearnedEdit';

const FeedItemEditModal = ({
  feedItem,
  onClose,
  onSave,
  tracesMinDateSec,
  tracesMaxDateSec,
  tracesAssetId,
}) => {
  if (feedItem.type === 'dvd_comment')
    return <DvDCommentEdit feedItem={feedItem} onClose={onClose} onSave={onSave} />;
  if (feedItem.type === 'hookload_broomstick_comment')
    return <HookloadCommentEdit feedItem={feedItem} onClose={onClose} onSave={onSave} />;
  if (feedItem.type === 'pc_comment')
    return <PCCommentEdit feedItem={feedItem} onClose={onClose} onSave={onSave} />;
  if (feedItem.type === 'npt_lessons_comment')
    return <NptLessonsCommentEdit feedItem={feedItem} onClose={onClose} onSave={onSave} />;
  if (feedItem.type === 'lessons_learned')
    return <LessonsLearnedEdit feedItem={feedItem} onClose={onClose} onSave={onSave} />;
  if (feedItem.type === FEED_ITEM_TYPES.POST)
    return (
      <PostPreviewDialog
        open
        title="Edit"
        fileUrl={feedItem.context?.post?.attachment?.url}
        fileName={
          feedItem.context?.post?.attachment?.url &&
          utils.getFileNameWithExtensionFromPath(feedItem.context?.post?.attachment?.url)
        }
        handleClose={onClose}
        handleShare={(body, fileUrl, fileSize, fileName) =>
          onSave({
            context: {
              post: {
                body,
                attachment: {
                  test: 1,
                  file_name: fileName,
                  url: fileUrl,
                  size: fileSize,
                },
              },
            },
          })
        }
        message={feedItem.context?.post?.body}
        okButtonText="Save"
        cancelButtonText="Discard changes"
        companyId={feedItem.company_id}
      />
    );
  if (feedItem.type === FEED_ITEM_TYPES.TRACES_MEMO)
    return (
      tracesMinDateSec &&
      tracesMaxDateSec &&
      tracesAssetId && (
        <TracesEditModal
          feedItem={feedItem}
          onSave={onSave}
          onClose={onClose}
          minDateSec={tracesMinDateSec}
          maxDateSec={tracesMaxDateSec}
          assetId={tracesAssetId}
        />
      )
    );

  return null;
};

FeedItemEditModal.propTypes = {
  feedItem: PropTypes.shape().isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  tracesMinDateSec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tracesMaxDateSec: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tracesAssetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FeedItemEditModal.defaultProps = {
  tracesMinDateSec: undefined,
  tracesMaxDateSec: undefined,
  tracesAssetId: undefined,
};

export default FeedItemEditModal;
