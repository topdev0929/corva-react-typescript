import { useState } from 'react';

import {
  Popover,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  withStyles,
  makeStyles,
} from '@material-ui/core';

import { Close as CloseIcon } from '@material-ui/icons';
import * as Typography from '~/components/Typography';

const StyledText20 = withStyles({ root: { marginBottom: 12 } })(Typography.Regular20);
const StyledText16 = withStyles({ root: { marginBottom: 12 } })(Typography.Regular16);
const CancelButton = withStyles({ root: { marginRight: 16 } })(Button);
const ActionButtons = withStyles({ root: { marginTop: 16 } })(Grid);
const StyledCloseIcon = withStyles(theme => ({
  root: {
    color: theme.palette.primary.text8,
    '&:hover': {
      color: 'white',
      cursor: 'pointer',
    },
  },
}))(CloseIcon);

const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

const useStyles = makeStyles({
  titleWithClose: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export const PopoverComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const styles = useStyles();

  return (
    <div>
      <Button onClick={handleClick}>Open Menu</Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        PaperProps={{
          style: {
            width: 242,
            padding: '24px 16px 16px 16px',
          },
        }}
      >
        <Grid container direction="column">
          <div className={styles.titleWithClose}>
            <StyledText20 paragraph>Settings</StyledText20>
            <StyledCloseIcon onClick={handleClose} />
          </div>
          <StyledText16 paragraph>Select KPIs</StyledText16>
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="BHA#"
          />
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="BHA Schematic"
          />
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="Bit RPM"
          />
        </Grid>
        <ActionButtons container direction="row-reverse" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleClose}>
            Save
          </Button>
          <CancelButton color="primary" onClick={handleClose}>
            Cancel
          </CancelButton>
        </ActionButtons>
      </Popover>
    </div>
  );
};

export default {
  title: 'Components/Popover Dialog',
  component: Popover,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      description: {
        component:
          '<div>Use MUI Popover. More information <a href="https://material-ui.com/components/popover/">here</a></div>',
      },
    },
  },
};
