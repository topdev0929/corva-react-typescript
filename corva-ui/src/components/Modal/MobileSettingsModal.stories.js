import { useState } from 'react';
import {
  Button,
  withStyles,
  Grid,
  makeStyles,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

import SwitchControl from '~/components/SwitchControl';
import Modal from '~/components/Modal';

export default {
  title: 'Components/App Settings',
  component: Modal,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Modal/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=16382%3A40936',
  },
};

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

const useModalState = () => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  return { open, handleOpenModal, handleCloseModal };
};

export const MobileSettingsModal = () => {
  const { open, handleOpenModal, handleCloseModal } = useModalState();

  const useStyles = makeStyles({
    container: {
      width: 375,
    },
    rootClassName: { width: 375 },
    switch: {
      marginLeft: -10,
      '& .MuiTypography-root': {
        color: '#ffffff',
      },
    },
    checkbox: { marginLeft: -12 },
    closeButton: {
      '&.MuiButtonBase-root': {
        margin: '0 0 0 auto !important',
      },
    },
  });

  const styles = useStyles();

  return (
    <Grid style={{ width: 375 }}>
      <StyledButton onClick={handleOpenModal} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        isNative
        open={open}
        onClose={handleCloseModal}
        type="settings"
        contentContainerClassName={styles.container}
        rootClassName={styles.rootClassName}
        actions={
          <StyledButton
            color="primary"
            onClick={handleCloseModal}
            className={styles.closeButton}
          >
            Close
          </StyledButton>
        }
      >
        <div>
          <SwitchControl rightLabel="Comments" color="primary" className={styles.switch} />
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="Show Comments for Days vs Depth/Cost"
            className={styles.checkbox}
          />
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="Show Comments for All Apps"
            className={styles.checkbox}
          />
        </div>
      </Modal>
    </Grid>
  );
};

MobileSettingsModal.storyName = 'Mobile Settings Modal';
