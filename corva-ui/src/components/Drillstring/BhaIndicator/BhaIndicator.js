import { oneOf } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const ALIGNS = {
  left: 'left',
  right: 'right',
};

const BhaIndicator = ({
  align,
}) => (
  <div className={classNames(styles.bhaIndicator, {
    [styles.bhaIndicatorLeft]: align === ALIGNS.left,
    [styles.bhaIndicatorRight]: align === ALIGNS.right,
  })}
  >
    <div>
      <div className={styles.bhaIndicatorColorBit} />
      <div className={styles.bhaIndicatorLabel}>
        Bit
      </div>
    </div>
    <div>
      <div className={styles.bhaIndicatorColorUr} />
      <div className={styles.bhaIndicatorLabel}>
        Under Reamer
      </div>
    </div>
    <div>
      <div className={styles.bhaIndicatorColorRss} />
      <div className={styles.bhaIndicatorLabel}>
        RSS
      </div>
    </div>
    <div>
      <div className={styles.bhaIndicatorColorPdm} />
      <div className={styles.bhaIndicatorLabel}>
        PDM
      </div>
    </div>
    <div>
      <div className={styles.bhaIndicatorColorOther} />
      <div className={styles.bhaIndicatorLabel}>
        Non-mag
      </div>
    </div>
    <div>
      <div className={styles.bhaIndicatorColorStabilizer} />
      <div className={styles.bhaIndicatorLabel}>
        Stabilizer
      </div>
    </div>
  </div>
);

BhaIndicator.propTypes = {
  align: oneOf(['left', 'right']),
};

BhaIndicator.defaultProps = {
  align: 'right',
};

export default BhaIndicator;
