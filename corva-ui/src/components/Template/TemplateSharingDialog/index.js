import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  makeStyles,
} from '@material-ui/core';
import { get } from 'lodash';
import classnames from 'classnames';

import { getUsers } from '~/clients/jsonApi';

import UsersChipSelector from './UsersChipSelector';

const useStyles = makeStyles({
  dialog: {
    width: '600px',
    height: '600px',
  },
  actions: {
    padding: '8px 40px',
    boxShadow: '0px -4px 10px rgb(0 0 0 / 25%)',
  },
  mobileActions: {
    paddingRight: '100px',
  },
});

function TemplateSharingDialog({ title, open, onSave, onCancel, currentUser }) {
  const classes = useStyles();
  const isFullScreen = false;

  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  useEffect(() => {
    async function handleFetchCompanyUsers() {
      try {
        const queryParams = {
          companyId: get(currentUser, ['company', 'id']),
        };
        const res = await getUsers(queryParams);
        const fetchedUsers = (res || [])
          .filter(item => get(item, 'id') !== get(currentUser, 'id'))
          .map(item => ({
            ...item,
            id: get(item, 'id'),
            displayName: `${get(item, 'first_name')} ${get(item, 'last_name')}`,
          }));
        setUsers(fetchedUsers);
      } catch (e) {
        console.error(e);
      }
    }

    handleFetchCompanyUsers();
  }, []);

  const handleAddSharesWithUser = id => {
    setSelectedUserIds(prev => new Set(prev.add(id)));
  };

  const handleRemoveSharesWithUser = id => {
    setSelectedUserIds(prev => {
      prev.delete(id);
      return new Set(prev);
    });
  };

  const handleSave = () => {
    onSave(users.filter(item => selectedUserIds.has(get(item, 'id'))));
    setSelectedUserIds(new Set());
  };

  const handleCancel = () => {
    setSelectedUserIds(new Set());
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullScreen={isFullScreen}
      classes={{ paper: classnames({ [classes.dialog]: !isFullScreen }) }}
    >
      <DialogTitle>{title || 'Share Templates'}</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Share with users
        </Typography>

        <UsersChipSelector
          users={users}
          selectedUsers={selectedUserIds}
          onAddUser={handleAddSharesWithUser}
          onRemoveUser={handleRemoveSharesWithUser}
        />
      </DialogContent>

      <DialogActions
        className={classnames(classes.actions, { [classes.mobileActions]: isFullScreen })}
      >
        <Button color="primary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TemplateSharingDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

TemplateSharingDialog.defaultProps = {
  title: null,
};

export default TemplateSharingDialog;
