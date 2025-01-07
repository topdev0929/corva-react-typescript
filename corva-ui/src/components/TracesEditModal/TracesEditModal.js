import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Grid, Button, Box } from '@material-ui/core';

import { Regular14 } from '~/components/Typography';
import Modal from '~/components/Modal';
import KeyboardDateTimePicker from '~/components/KeyboardDateTimePicker';
import PostInput from '~/components/PostInput';

import styles from './TracesEditModal.css';

const PAGE_NAME = 'TracesEditModal';

const TIME_FORMAT = 'MM/DD/YYYY, HH:mm';

const TracesMemoModal = ({
  onClose,
  onApply,
  postValue,
  onPostChange,
  timestampMs,
  onTimestampChange,
  timestampError,
  minDateMs,
  maxDateMs,
  isApplyDisabled,
  isDepthDataLoading,
  holeDepth,
  bitDepth,
  userCompanyId,
}) => {
  return (
    <Modal
      open
      onClose={onClose}
      title="Edit"
      contentClassName={styles.modal}
      actions={
        <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
          <Grid item>
            <Button data-testid={`${PAGE_NAME}_cancel`} color="primary" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-testid={`${PAGE_NAME}_apply`}
              variant="contained"
              color="primary"
              disabled={isApplyDisabled}
              onClick={onApply}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      }
    >
      <PostInput
        className={styles.modalPostInput}
        initialValue={postValue}
        userCompanyId={userCompanyId}
        onChange={onPostChange}
      />
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" mb={2}>
          <span className={styles.modalFieldLabel}>Time</span>
          <KeyboardDateTimePicker
            data-testid={`${PAGE_NAME}_date`}
            className={styles.modalDateInput}
            disabled={isDepthDataLoading}
            ampm={false}
            value={timestampMs}
            minDate={minDateMs}
            maxDate={maxDateMs}
            onChange={onTimestampChange}
            format={TIME_FORMAT}
            error={!!timestampError}
            helperText={timestampError}
          />
        </Box>
        <Box display="flex" flexDirection="column" mb={3}>
          <span className={styles.modalFieldLabel}>Hole Depth</span>
          <Regular14 data-testid={`${PAGE_NAME}_holeDepth`}>
            {isDepthDataLoading ? 'Loading...' : `${holeDepth}’`}
          </Regular14>
        </Box>
        <Box display="flex" flexDirection="column">
          <span className={styles.modalFieldLabel}>Bit Depth</span>
          <Regular14 data-testid={`${PAGE_NAME}_bitDepth`}>
            {isDepthDataLoading ? 'Loading...' : `${bitDepth}’`}
          </Regular14>
        </Box>
      </Box>
    </Modal>
  );
};

TracesMemoModal.propTypes = {
  isApplyDisabled: PropTypes.bool,
  isDepthDataLoading: PropTypes.bool,
  userCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  timestampMs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  minDateMs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxDateMs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  timestampError: PropTypes.string,
  holeDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bitDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialAttachment: PropTypes.shape({}),
  postValue: PropTypes.shape({
    body: PropTypes.string,
    attachment: PropTypes.shape({}),
  }).isRequired,
  onPostChange: PropTypes.func.isRequired,
  onTimestampChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
};

TracesMemoModal.defaultProps = {
  initialAttachment: null,
  onClose: noop,
  onApply: noop,
  timestampError: '',
  isApplyDisabled: false,
  isDepthDataLoading: false,
};

export default TracesMemoModal;
