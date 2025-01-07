import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MentionsInput, Mention } from 'react-mentions';
import blue from '@material-ui/core/colors/blue';
import { withPermissionsHOC, PERMISSIONS } from '~/permissions';
import Avatar from '~components/Avatar';

import { handleFetchUsers } from './utils';
import { USER_MARKUP } from './constants';

import styles from './style.css';

const PAGE_NAME = 'userMention';

const muiStyles = {
  avatar: {
    height: 45,
    width: 45,
    border: '1.5px solid #fff',
  },
};

const mentionLightStyle = {
  backgroundColor: blue[100],
};
const mentionDarkStyle = {
  color: '#00bcd4',
};

// NOTE: IMPORTANT! 'input', 'mention' and 'highliter' should always have same font/latter/height/line etc values
const inputStyles = {
  suggestions: {
    item: {
      '&focused': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
};

const darkThemeInputStyles = {
  ...inputStyles,
  input: {
    color: '#fff',
    caretColor: '#fff',
    zIndex: 1,
  },
  highlighter: {
    color: '#fff',
  },
};

const lightThemeInputStyles = {
  ...inputStyles,
  input: { color: '#000' },
};

const renderSuggestion = (entry, classes) => (
  <div className={styles.mention__suggestion}>
    <Avatar
      alt={entry.display}
      displayName={entry.display}
      className={classes.avatar}
      imgSrc={entry.photo}
    />
    <div className={styles.mention__suggestion__info}>
      <span
        data-testid={`${PAGE_NAME}_name_${entry.display}`}
        className={styles.mention__suggestion__info__name}
      >
        {entry.display}
      </span>
      {entry.title && (
        <span className={styles.mention__suggestion__info__group}>{entry.title}</span>
      )}
    </div>
  </div>
);

const UserMention = ({
  onChange,
  singleLine,
  suggestionsPortalHost,
  value,
  inputRef,
  classes,
  style,
  withLightTheme,
  placeholder,
  onMount,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  autoFocus,
  disabled,
  companyId,
  currentUser,
  isCompanySelectVisible,
  mentionProps,
  allowSuggestionsAboveCursor,
}) => {
  useEffect(onMount, []);

  const fetchUsers = (search, callback) => {
    const companyIds =
      isCompanySelectVisible && currentUser && currentUser.company_id !== companyId
        ? [currentUser.company_id, companyId]
        : null;

    handleFetchUsers(search, callback, companyIds);
  };

  const debouncedUsersFetch = useCallback(debounce(fetchUsers, 400), [companyId]);

  const onInputChange = (event, newValue) => {
    onChange(newValue);
  };

  const themedStyle = Object.assign(
    withLightTheme ? lightThemeInputStyles : darkThemeInputStyles,
    style
  );

  return (
    <MentionsInput
      value={value}
      onChange={onInputChange}
      singleLine={singleLine}
      allowSpaceInQuery
      classNames={styles}
      placeholder={placeholder}
      suggestionsPortalHost={suggestionsPortalHost}
      inputRef={inputRef}
      style={themedStyle}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      allowSuggestionsAboveCursor={allowSuggestionsAboveCursor}
    >
      <Mention
        markup={USER_MARKUP}
        renderSuggestion={entry => renderSuggestion(entry, classes)}
        trigger="@"
        data={debouncedUsersFetch}
        displayTransform={(id, display) => `@${display}`}
        style={withLightTheme ? mentionLightStyle : mentionDarkStyle}
        appendSpaceOnAdd
        {...mentionProps}
      />
    </MentionsInput>
  );
};

UserMention.propTypes = {
  onChange: PropTypes.func,
  singleLine: PropTypes.bool,
  suggestionsPortalHost: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  value: PropTypes.string,
  inputRef: PropTypes.shape({}),
  classes: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  withLightTheme: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.shape({}),
  mentionProps: PropTypes.shape({}),
  onMount: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,

  currentUser: PropTypes.shape({
    company_id: PropTypes.number.isRequired,
  }).isRequired,
  companyId: PropTypes.number,
  isCompanySelectVisible: PropTypes.bool.isRequired,
  allowSuggestionsAboveCursor: PropTypes.bool,
};

UserMention.defaultProps = {
  onChange: () => undefined,
  singleLine: false,
  suggestionsPortalHost: null,
  value: '',
  inputRef: null,
  withLightTheme: false,
  placeholder: "Mention people using '@'",
  style: {
    suggestions: {
      list: {
        background: '#414141',
      },
      item: {
        color: 'white',
        height: 30,
        '&focused': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
  mentionProps: {},
  onMount: () => undefined,
  onKeyDown: () => undefined,
  onKeyUp: () => undefined,
  onFocus: () => undefined,
  onBlur: () => undefined,
  autoFocus: true,
  disabled: false,
  allowSuggestionsAboveCursor: false,
  companyId: null,
};

export default withPermissionsHOC({ isCompanySelectVisible: PERMISSIONS.companySelectorView })(
  withStyles(muiStyles)(UserMention)
);
