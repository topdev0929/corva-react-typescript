import PropTypes from 'prop-types';
import { get } from 'lodash';
import Avatar from '~components/Avatar';

import ChipSelector from './ChipSelector';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
  username: {
    marginLeft: 20,
  },
};

const listUserFormatter = user => (
  <div style={styles.container}>
    <Avatar displayName={get(user, 'displayName')} imgSrc={get(user, 'profilePhoto')} />
    <div style={styles.username}>{get(user, 'displayName')}</div>
  </div>
);

const UsersChipSelector = ({ users, selectedUsers, onAddUser, onRemoveUser }) => (
  <ChipSelector
    items={users}
    selectedItems={selectedUsers}
    onAdd={onAddUser}
    onRemove={onRemoveUser}
    chipFormatter={user => get(user, 'displayName')}
    listItemFormatter={listUserFormatter}
    hintText="Type user name..."
    errorText="You can not add not existing user"
    listTitle="Recent users"
  />
);

UsersChipSelector.propTypes = {
  selectedUsers: PropTypes.shape([]).isRequired,
  onAddUser: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      displayName: PropTypes.string.isRequired,
      persistent: PropTypes.bool,
    })
  ).isRequired,
};

export default UsersChipSelector;
