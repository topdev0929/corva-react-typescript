import { useState } from 'react';
import { Chip, Tooltip, makeStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import MiddleTruncate from '../MiddleTruncate';
import { ChipProps, StyleProps } from './types';
import utils from '~/utils/main';
import SubjectIcon from './icons/SubjectIcon';

const useStyles = makeStyles(theme => ({
  chipRoot: {
    position: 'relative',
    height: 30,
    padding: '7px 12px',
    fontSize: 12,
    color: theme.palette.primary.text6,
    margin: '2px 4px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: theme.palette.primary.contrastText,
    },
  },
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    padding: 0,
  },
  mark: {
    display: ({ isShowMark }: StyleProps) => (isShowMark ? 'block' : 'none'),
    marginRight: 4,
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: ({ markColor }: StyleProps) => markColor,
  },
  subject: {
    display: 'flex',
    marginRight: 4,
  },
  closeIcon: {
    fontSize: '1rem',
    marginLeft: '4px',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 30,
  },
  tooltip: {
    marginTop: '8px',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const OffsetWellChip = <T extends unknown>({
  title,
  onClick,
  markColor,
  isSubject,
  rigName,
  maxWidth,
  wellId,
  onRemoveOffsetWell,
  isShowMark,
}: ChipProps<T>): JSX.Element => {
  const [truncatedText, setTruncatedText] = useState(null);

  const styles = useStyles({
    markColor: markColor || `#${utils.getColorFromString(title)}`,
    isShowMark,
  });
  const isTruncated = !!truncatedText;
  const fullTooltip = rigName ? `${title} | ${rigName}` : title;

  const handleTruncatedText = truncatedText => {
    setTruncatedText(truncatedText);
  };

  const handleRemoveWell = e => {
    e.stopPropagation();
    if (onRemoveOffsetWell) onRemoveOffsetWell(wellId);
  };

  const label = (
    <div className={styles.root}>
      <Tooltip title={isTruncated ? fullTooltip : rigName} classes={{ popper: styles.tooltip }}>
        <div className={styles.titleContainer}>
          {isSubject ? (
            <span className={styles.subject}>
              <SubjectIcon />
            </span>
          ) : (
            <span className={styles.mark} />
          )}
          <MiddleTruncate
            onTruncate={handleTruncatedText}
            truncatedText={truncatedText}
            maxWidth={maxWidth}
          >
            {title}
          </MiddleTruncate>
        </div>
      </Tooltip>
      {!isSubject && !!onRemoveOffsetWell && (
        <>
          <Close className={styles.closeIcon} />
          <Tooltip title="Remove" classes={{ popper: styles.tooltip }}>
            <div className={styles.closeArea} onClick={handleRemoveWell}></div>
          </Tooltip>
        </>
      )}
    </div>
  );

  return (
    <Chip
      data-not-migrated-MuiChip
      variant="outlined"
      size="medium"
      label={label}
      classes={{ root: styles.chipRoot, label: styles.label }}
      onClick={e => onClick && onClick(e, wellId)}
    />
  );
};

OffsetWellChip.defaultProps = {
  onClick: null,
  markColor: null,
  maxWidth: 200,
  rigName: null,
  isShowMark: true,
  onRemoveOffsetWell: null,
};

export default OffsetWellChip;
