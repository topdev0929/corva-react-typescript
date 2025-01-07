import PropTypes from 'prop-types';
import { Button, withStyles, makeStyles } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { Modal, Typography } from '~/components';

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);
const StyledText = withStyles({ root: { color: '#bdbdbd' } })(Typography.Regular16);

export const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: ({ isMobile }) => (isMobile ? 0 : '416px'),
    minHeight: ({ isMobile }) => isMobile && '240px !important',
    maxWidth: ({ isMobile }) => isMobile && 'calc(100% - 24px)',
  },
  content: {
    width: ({ isMobile }) => (isMobile ? 'auto' : '300px'),
    color: theme.palette.primary.text6,
  },
}));

export const ConfirmationPopup = ({ title, text, okText, handleClose, handleOk }) => {
  const styles = useStyles({ isMobile: isMobileDetected });

  return (
    <Modal
      open
      onClose={handleClose}
      title={title}
      isMobile={false}
      actions={
        <>
          <ClearAllButton color="primary" onClick={handleClose}>
            Cancel
          </ClearAllButton>

          <StyledButton variant="contained" color="primary" onClick={handleOk}>
            {okText || 'OK'}
          </StyledButton>
        </>
      }
      contentContainerClassName={styles.paper}
    >
      <div className={styles.content}>
        <StyledText>{text}</StyledText>
      </div>
    </Modal>
  );
};

ConfirmationPopup.propTypes = {
  title: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
};
