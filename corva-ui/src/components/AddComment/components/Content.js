import { useRef } from 'react';
import { node, number, func, bool, shape } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import { PostInput } from '~/components';
import { isSuggestionsListOpened } from '~/components/UserMention/utils';

const useStyles = makeStyles({
  postInput: { paddingBottom: 8 },
  filePreviewWrapper: ({ smallerView }) => ({
    width: '100%',
    marginLeft: 0,
    maxHeight: smallerView ? 127 : 251,
  }),
});
function Content({
  userCompanyId,
  startAdornment,
  endAdornment,
  customContent,
  setComment,
  smallerView,
  onSave,
  comment,
}) {
  const classes = useStyles({ smallerView });
  const wrapperRef = useRef();

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isSuggestionsListOpened()) {
      e.preventDefault();
      onSave(comment);
    }
  };

  return (
    <div ref={wrapperRef}>
      {startAdornment}

      {customContent || (
        <PostInput
          userCompanyId={userCompanyId}
          onChange={setComment}
          filePreviewWrapperClass={classes.filePreviewWrapper}
          className={classes.postInput}
          smallerView={smallerView}
          onKeyDown={onKeyDown}
          suggestionsPortalHost={wrapperRef.current}
          allowSuggestionsAboveCursor
        />
      )}

      {endAdornment}
    </div>
  );
}

Content.propTypes = {
  startAdornment: node,
  endAdornment: node,
  customContent: node,
  userCompanyId: number.isRequired,
  setComment: func,
  onSave: func,
  smallerView: bool,
  comment: shape(),
};

Content.defaultProps = {
  startAdornment: null,
  endAdornment: null,
  customContent: null,
  setComment: () => undefined,
  onSave: () => undefined,
  smallerView: false,
  comment: undefined,
};

export default Content;
