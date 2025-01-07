import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, withStyles, TextField } from '@material-ui/core';

import Modal from '~/components/Modal';

import LeftArrow from './icons/LeftArrow';
import GoLive from './icons/GoLive';
import RightArrow from './icons/RightArrow';
import ZoomIn from './icons/ZoomIn';
import TimeRange from './icons/TimeRange';
import ZoomOut from './icons/ZoomOut';

import styles from './ChartActionsList.css';

const MIN_VALUE = 1;

const ChartActionsList = ({ onChange, min, max, left, right, classes }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leftValue, setLeftValue] = useState(left);
  const [rightValue, setRightValue] = useState(right);

  useEffect(() => {
    setRightValue(right);
    setLeftValue(left);
  }, [left, right]);

  const isZoomInActive = right - left >= MIN_VALUE;
  const isZoomOutActive = min < left || max > right;
  const isGoLeftActive = left > min;
  const isGoRightActive = right < max;
  const isGoLiveActive = right !== max;
  const isJumpDisabled = leftValue < min || rightValue > max || leftValue + MIN_VALUE > rightValue;

  const onZoomIn = () => {
    const diff = right - left;
    let newLeft = left + diff / 4;
    let newRight = right - diff / 4;
    const newValueDiff = newRight - newLeft;

    if (newValueDiff < MIN_VALUE) {
      const minValueDiff = (MIN_VALUE - newValueDiff) / 2;
      newLeft += minValueDiff;
      newRight -= minValueDiff;
    }

    onChange({ left: newLeft, right: newRight });
  };

  const onZoomOut = () => {
    const diff = right - left;
    let newLeft = left - diff / 2;
    let newRight = right + diff / 2;
    const newDiff = newRight - newLeft;
    if (newLeft < min && newRight > max) {
      newLeft = min;
      newRight = max;
    } else if (newLeft < min) {
      newLeft = min;
      newRight = min + newDiff;
    } else if (newRight > max) {
      newRight = max;
      newLeft = max - newDiff;
    }
    onChange({ left: newLeft, right: newRight });
  };

  const onGoLeft = () => {
    const diff = (right - left) * 0.75;
    let newLeft = left - diff;
    let newRight = right - diff;

    if (newLeft < min) {
      newLeft = min;
      newRight = min + diff;
    }
    onChange({ left: newLeft, right: newRight });
  };

  const onGoRight = () => {
    const diff = (right - left) * 0.75;
    let newLeft = left + diff;
    let newRight = right + diff;

    if (newRight > max) {
      newRight = max;
      newLeft = max - diff;
    }
    onChange({ left: newLeft, right: newRight });
  };

  const onLive = () => {
    onChange({ left, right: max });
  };

  const onMinMaxSet = () => {
    setIsModalVisible(true);
  };

  const onLeftValueChange = e => {
    setLeftValue(parseFloat(e.target.value));
  };

  const onRightValueChange = e => {
    setRightValue(parseFloat(e.target.value));
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSave = () => {
    onChange({ left: leftValue, right: rightValue });
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <span
        className={classnames(styles.action, !isZoomInActive && styles.disabled)}
        onClick={onZoomIn}
      >
        <ZoomIn isActive={isZoomInActive} />
      </span>
      <span
        className={classnames(styles.action, !isZoomOutActive && styles.disabled)}
        onClick={onZoomOut}
      >
        <ZoomOut isActive={isZoomOutActive} />
      </span>
      <span
        className={classnames(styles.action, !isGoLeftActive && styles.disabled)}
        onClick={onGoLeft}
      >
        <LeftArrow isActive={isGoLeftActive} />
      </span>
      <span
        className={classnames(styles.action, !isGoRightActive && styles.disabled)}
        onClick={onGoRight}
      >
        <RightArrow isActive={isGoRightActive} />
      </span>
      <span
        className={classnames(styles.action, !isGoLiveActive && styles.disabled)}
        onClick={onLive}
      >
        <GoLive isActive={isGoLiveActive} />
      </span>
      <span className={styles.action} onClick={onMinMaxSet}>
        <TimeRange />
      </span>
      <Modal
        open={isModalVisible}
        onClose={onModalClose}
        title="Jump to Selected Range"
        actions={
          <div className={styles.actions}>
            <Button variant="textPrimary" onClick={onModalClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={onSave} disabled={isJumpDisabled}>
              Apply
            </Button>
          </div>
        }
      >
        <form noValidate className={styles.form}>
          <TextField
            id="depth-from"
            label="From"
            type="number"
            defaultValue={leftValue}
            onChange={onLeftValueChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={leftValue < min}
            autoFocus
            className={classes.input}
            fullWidth
          />
          <TextField
            id="depth-from"
            label="To"
            type="number"
            defaultValue={rightValue}
            onChange={onRightValueChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={rightValue > max}
            fullWidth
          />
        </form>
      </Modal>
    </div>
  );
};

ChartActionsList.propTypes = {
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  classes: PropTypes.shape({}).isRequired,
};
export default withStyles({
  input: {
    marginRight: 20,
  },
})(ChartActionsList);
