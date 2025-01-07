import { makeStyles } from '@material-ui/core';
import OffsetWellChip from './Chip';
import { ChipsContainerProps } from './types';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '8px',
  },
}));

const OffsetWellChips = <T extends unknown>({
  wells,
  maxWidth,
  onRemoveOffsetWell,
  isShowMark = true,
  onChipClick = null,
  chipsContainerClassName,
}: ChipsContainerProps<T>): JSX.Element => {
  const styles = useStyles();

  return (
    <div className={classnames(styles.container, chipsContainerClassName)}>
      {wells.map(({ wellId, title, isSubject, markColor, rigName }) => (
        <OffsetWellChip
          key={wellId as string | number}
          maxWidth={maxWidth}
          title={title}
          isSubject={isSubject}
          markColor={markColor}
          rigName={rigName}
          wellId={wellId}
          onRemoveOffsetWell={onRemoveOffsetWell}
          isShowMark={isShowMark}
          onClick={onChipClick}
        />
      ))}
    </div>
  );
};

export default OffsetWellChips;
