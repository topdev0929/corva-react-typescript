import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

import styles from './style.css';
import { UniversalLink } from '../DevCenter/DevCenterRouterContext';

const PAGE_NAME = 'UserCardDialogPo';

const muiStyles = theme => ({
  card: {
    width: 352,
  },
  media: {
    height: 264,
    width: '100%',
  },
  content: { cursor: 'auto', padding: '10px 28px 28px 28px' },
  userName: { fontWeight: 'bold' },
  contact: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    cursor: 'pointer',
  },
  contactIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
    color: theme.palette.grey[300],
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 28px 28px 28px',
  },
  actionButton: {
    width: 139,
  },
});

function UserCard({
  user: {
    id,
    email,
    mobile,
    title,
    first_name: firstName,
    last_name: lastName,
    profile_photo: profilePhoto,
  },
  currentUser,
  classes,
}) {
  return (
    <Card data-testid={`${PAGE_NAME}`} className={classes.card}>
      <CardMedia
        data-testid={`${PAGE_NAME}_placeholder`}
        className={classes.media}
        image={profilePhoto || 'https://cdn.corva.ai/app/images/user-placeholder.svg'}
        title={`${firstName} ${lastName}`}
      >
        {Number(currentUser.id) === Number(id) && (
          <div className={styles.cUserCardMediaBackdrop}>
            <UniversalLink href={`/config/users/${id}`}>
              <Chip
                data-not-migrated-MuiChip
                data-testid={`${PAGE_NAME}_viewProfile`}
                className={styles.cUserCardMediaBackdropToProfile}
                label="View Profile"
              />
            </UniversalLink>
          </div>
        )}
      </CardMedia>
      <CardContent className={classes.content}>
        <Typography data-testid={`${PAGE_NAME}_name`} variant="h5" className={classes.userName}>
          {`${firstName} ${lastName}`}
        </Typography>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        <br />
        {email && (
          <a href={`mailto:${email}`} target="_top">
            <Typography
              data-testid={`${PAGE_NAME}_email`}
              gutterBottom
              variant="body1"
              className={classes.contact}
            >
              <EmailIcon className={classes.contactIcon} />
              {email}
            </Typography>
          </a>
        )}
        {mobile && (
          <a href={`tel:${mobile}`} target="_top">
            <Typography
              data-testid={`${PAGE_NAME}_phone`}
              variant="body1"
              className={classes.contact}
            >
              <PhoneIcon className={classes.contactIcon} />
              {mobile}
            </Typography>
          </a>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        {email ? (
          <a href={`mailto:${email}`} target="_top">
            <Button
              data-testid={`${PAGE_NAME}_emailButton`}
              className={classes.actionButton}
              variant="contained"
              color="primary"
            >
              Email
            </Button>
          </a>
        ) : (
          <Button disabled className={classes.actionButton} variant="contained" color="primary">
            Email
          </Button>
        )}

        {/* NOTE: Disabled since chat is turned off */}
        <Button
          data-testid={`${PAGE_NAME}_messageButton`}
          disabled
          className={classes.actionButton}
          variant="contained"
          color="primary"
        >
          Message
        </Button>
      </CardActions>
    </Card>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string,
    mobile: PropTypes.string,
    title: PropTypes.string,
    role: PropTypes.string,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    profile_photo: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

UserCard.defaultProps = {
  currentUser: {},
};

export default withStyles(muiStyles)(UserCard);
