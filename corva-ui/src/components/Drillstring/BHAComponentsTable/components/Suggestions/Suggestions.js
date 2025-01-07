import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Tooltip, makeStyles } from '@material-ui/core';
import { isMobileDetected } from '~/utils/mobileDetect';
import { getUnitDisplay } from '~/utils';

import AutoCompleteDialog from './AutoCompleteDialog';

const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginBottom: '16px',
    marginLeft: ({ isMobile }) => (isMobile ? '8px' : 0),
  },
  tagsContainer: {
    width: '100%',
    position: 'relative',
  },
  tags: {
    width: '100%',
    overflowX: 'auto',
    display: 'flex',
    paddingBottom: ({ isMobile }) => (isMobile ? '8px' : '5px'),
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(20, 20, 20, 0.8)',
      borderRadius: '10px',
      border: '1px solid rgba(28, 28, 28, 0.01)',
      backgroundClip: 'padding-box',
      boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  tagWrapper: {
    marginRight: '10px',
  },
  tag: {
    maxWidth: '150px',
    padding: '3.5px 10px 3.5px',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.text6,
    border: '1px solid #616161',
    borderRadius: '40px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  tooltip: {
    background: 'rgba(59,59,59,0.9)',
    borderRadius: '4px',
    padding: '8px',
  },
  cta: {
    marginTop: '2px',
    color: theme.palette.primary.main,
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.15px',
    lineHeight: '19px',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  shadow: {
    width: '24px',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    top: 0,
  },
  leftShadow: {
    left: 0,
    background: `linear-gradient(-90deg, rgba(39, 39, 39, 0) 0%, ${theme.palette.background.b5} 100%)`,
  },
  rightShadow: {
    right: 0,
    background: `linear-gradient(90deg, rgba(39, 39, 39, 0) 0%, ${theme.palette.background.b5} 100%)`,
  },
  tooltipContainer: {
    background: theme.palette.background.b8,
    opacity: 0.9,
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tooltipLine: {
    height: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  tooltipUnit: {
    fontSize: '12px',
    color: theme.palette.primary.text6,
  },
}));

const TagDescription = ({ descriptionKeys, columnMaps, dataItem }) => {
  const styles = useStyles();
  return (
    <div className={styles.tooltipContainer}>
      {descriptionKeys.map(key => (
        <div className={styles.tooltipLine} key={key}>
          <span>{columnMaps[key].label}:&nbsp;</span>
          <span>{dataItem[key] || '-'}</span>
          {columnMaps[key].unitType && (
            <span className={styles.tooltipUnit}>
              &nbsp;{getUnitDisplay(columnMaps[key].unitType)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

TagDescription.propTypes = {
  descriptionKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnMaps: PropTypes.shape({}).isRequired,
  dataItem: PropTypes.shape({}).isRequired,
};

function Suggestions({ data, allData, columns, displayKeys, descriptionKeys, onSelect, isCasing }) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const classes = useStyles({ isMobile: isMobileDetected });
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const containerRef = useRef();

  const columnMaps = useMemo(() => {
    return columns.reduce((result, column) => {
      return { ...result, [column.key]: column };
    }, {});
  }, [columns]);

  const updateShadows = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft } = containerRef.current;
      setShowLeftShadow(!!scrollLeft);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateShadows);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleOpenSelectDialog = () => {
    setIsSelectDialogOpen(true);
  };

  const handleCloseSelectDialog = () => {
    setIsSelectDialogOpen(false);
  };

  const handleSelect = suggestion => {
    setIsSelectDialogOpen(false);
    onSelect(suggestion);
  };

  const renderTag = dataItem => {
    if (isCasing) {
      return displayKeys.map(key => `${dataItem[key]}"`).join('/');
    }
    return displayKeys.map(key => dataItem[key]).join(' ');
  };

  return (
    <div className={classes.suggestions}>
      <div className={classes.tagsContainer}>
        <div className={classes.tags} ref={containerRef} onScroll={updateShadows}>
          {data.map((dataItem, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className={classes.tagWrapper} key={idx}>
              <Tooltip
                classes={{ tooltip: classes.tooltip }}
                title={
                  <TagDescription
                    descriptionKeys={descriptionKeys}
                    columnMaps={columnMaps}
                    dataItem={dataItem}
                  />
                }
              >
                <div className={classes.tag} onClick={() => onSelect(dataItem)}>
                  {renderTag(dataItem)}
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
        {showLeftShadow && <div className={classNames(classes.shadow, classes.leftShadow)} />}
        <div className={classNames(classes.shadow, classes.rightShadow)} />
      </div>
      <div className={classes.cta} onClick={handleOpenSelectDialog}>
        Show all AutoComplete results
      </div>
      {isSelectDialogOpen && (
        <AutoCompleteDialog
          data={allData}
          columns={columns}
          onClose={handleCloseSelectDialog}
          onSelect={handleSelect}
          isMobile={isMobileDetected}
        />
      )}
    </div>
  );
}

Suggestions.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  displayKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  descriptionKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  isCasing: PropTypes.bool,
};

Suggestions.defaultProps = {
  isCasing: false,
};

export default memo(Suggestions);
