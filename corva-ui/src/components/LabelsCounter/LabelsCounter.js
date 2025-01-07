import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { makeStyles, Tooltip, Chip } from '@material-ui/core';
import TruncatedText from '../TruncatedText';

const useStyles = makeStyles({
  assetsCount: {
    maxWidth: 168,
    whiteSpace: 'nowrap',
  },
  countChip: {
    marginLeft: 8,
  },
});

const LabelsCounter = ({ items, limit }) => {
  const styles = useStyles();

  const [firstItem, ...restItems] = items;

  if (isEmpty(items)) return null;

  return (
    <>
      <Chip
        label={
          <div className={styles.assetsCount}>
            <TruncatedText>{firstItem}</TruncatedText>
          </div>
        }
      />
      {items.length > 1 && (
        <Tooltip
          title={
            <div>
              {restItems.map((item, index) => (
                <div key={item}>
                  {item}
                  {`${index < restItems.length - 1 ? ',' : ''}`}
                </div>
              ))}
            </div>
          }
        >
          <Chip
            label={items.length <= limit ? `+${items.length - 1}` : `${limit - 1}+`}
            className={styles.countChip}
          />
        </Tooltip>
      )}
    </>
  );
};

LabelsCounter.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  limit: PropTypes.number,
};

LabelsCounter.defaultProps = {
  limit: 100,
};

export default LabelsCounter;
