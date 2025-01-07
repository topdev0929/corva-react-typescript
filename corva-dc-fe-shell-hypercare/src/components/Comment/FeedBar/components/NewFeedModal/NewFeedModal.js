import { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import moment from 'moment';

import { Box, IconButton, Modal, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { PostInput, Typography } from '@corva/ui/components';

// import PostInput from '../FeedItem/PostInput';

const TIME_FORMAT = 'MM.DD.YYYY, HH:mm';

const useStyles = makeStyles(theme => ({
  newFeedModal: {
    maxWidth: '450px',
    width: '352px',
    padding: '8px',
  },

  newFeedModalFieldLabel: {
    color: '#bdbdbd',
  },

  newFeedModalPostInput: {
    marginTop: '14px',
    marginBottom: '16px',
  },

  modalContent: {
    backgroundColor: theme.palette.background.b9,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80%',
    outline: 'none',
    padding: 8,
    maxWidth: 450,
    width: 352,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const NewFeedModal = ({ isOpened, onClose, onSend, timestamp, userCompanyId }) => {
  const [postInputValue, setPostInputValue] = useState({
    body: '',
    attachment: null,
  });
  const classes = useStyles();

  const handleClickSend = () => {
    onSend({
      body: postInputValue.body,
      attachment: postInputValue.attachment,
      timestamp,
    });
  };

  return (
    <Modal open={isOpened} onClose={onClose} contentClassName={classes.newFeedModal}>
      <div className={classes.modalContent}>
        <PostInput
          className={classes.newFeedModalPostInput}
          userCompanyId={userCompanyId}
          onChange={setPostInputValue}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <span className={classes.newFeedModalFieldLabel}>Time:&nbsp;</span>
            <Typography.Regular14>
              {moment(timestamp * 1000).format(TIME_FORMAT)}
            </Typography.Regular14>
          </Box>
          <IconButton
            onClick={handleClickSend}
            disabled={!postInputValue.body && !postInputValue.attachment}
          >
            <SendIcon color="primary" />
          </IconButton>
        </Box>
      </div>
    </Modal>
  );
};

NewFeedModal.propTypes = {
  userCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpened: PropTypes.bool,
  onClose: PropTypes.func,
  onSend: PropTypes.func,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

NewFeedModal.defaultProps = {
  isOpened: false,
  onClose: noop,
  onSend: noop,
};

export default NewFeedModal;
