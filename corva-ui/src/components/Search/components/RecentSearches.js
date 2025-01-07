import { useEffect } from 'react';
import { take, isEmpty } from 'lodash';
import { makeStyles, Typography } from '@material-ui/core';
import TimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles(({ palette }) => ({
  recentSearchesWrapper: {
    paddingBottom: '8px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
  },
  label: {
    lineHeight: '36px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  caption: {
    color: palette.primary.text6,
    fontSize: '12px',
    padding: '16px 0 8px 16px',
  },
  recentSearchesIcon: {
    width: '16px',
    height: '16px',
    color: palette.primary.text6,
    marginRight: '16px',
  },
}));

const getRecentSearchesFromStorage = (dataStorage, key) => {
  return JSON.parse(dataStorage.getItem(key)) || [];
};

const setRecentSearchesToStorage = (dataStorage, key, recentSearches) => {
  dataStorage.setItem(key, JSON.stringify(recentSearches));
};

const RecentSearches = ({
  onInputChange,
  inputValue,
  isHidden,
  maxCount,
  dataStorageKey,
  dataStorage,
}) => {
  const recentSearches = getRecentSearchesFromStorage(dataStorage, dataStorageKey);

  const classes = useStyles();

  const handleRecentSearchesChange = searchValue => {
    setRecentSearchesToStorage(
      dataStorage,
      dataStorageKey,
      take([searchValue, ...recentSearches], maxCount)
    );
  };

  const handleRecentSearchesClick = label => {
    setRecentSearchesToStorage(
      dataStorage,
      dataStorageKey,
      recentSearches.filter(searchItem => searchItem !== label)
    );
    onInputChange(label);
  };

  useEffect(() => {
    if (!inputValue?.trim() || recentSearches.includes(inputValue)) {
      return;
    }

    handleRecentSearchesChange(inputValue);
  }, [inputValue]);

  if (isEmpty(recentSearches) || isHidden) return null;

  const recentSearchesContent = recentSearches?.map(label => (
    <div
      className={classes.option}
      key={label}
      onClick={() => {
        handleRecentSearchesClick(label);
      }}
    >
      <TimeIcon className={classes.recentSearchesIcon} />
      <div className={classes.label}>{label}</div>
    </div>
  ));

  return (
    <div className={classes.recentSearchesWrapper}>
      <Typography className={classes.caption}>Recent Searches</Typography>
      {recentSearchesContent}
    </div>
  );
};

export default RecentSearches;
