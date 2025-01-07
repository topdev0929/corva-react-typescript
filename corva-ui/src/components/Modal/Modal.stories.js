import { useState } from 'react';
import {
  Button,
  withStyles,
  Grid,
  makeStyles,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

import SwitchControl from '~/components/SwitchControl';
import * as Typography from '~/components/Typography';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import Modal from '~/components/Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    type: {
      control: 'radio',
      options: ['Without Scroll', 'With Scroll'],
    },
  },
  args: {
    type: 'Without Scroll',
  },
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
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);
const StyledDeleteIcon = withStyles({ root: { marginRight: 8 } })(DeleteIcon);
const StyledText = withStyles({ root: { color: '#bdbdbd' } })(Typography.Regular16);
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

export const WithTitle = () => {
  const { open, handleOpenModal, handleCloseModal } = useModalState();

  return (
    <Grid>
      <StyledButton onClick={handleOpenModal} variant="contained" color="primary">
        Open Modal
      </StyledButton>
      <Modal open={open} onClose={handleCloseModal} title="Very nice dialog title">
        <div style={{ width: '300px', paddingBottom: 24, color: '#bdbdbd' }}>
          <StyledText paragraph>Dialog content</StyledText>
        </div>
      </Modal>
    </Grid>
  );
};

export const WithTitleAndActions = () => {
  const { open, handleOpenModal, handleCloseModal } = useModalState();

  return (
    <Grid>
      <StyledButton onClick={handleOpenModal} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Modal Title"
        actions={
          <>
            <ClearAllButton color="primary" onClick={handleCloseModal}>
              Cancel
            </ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={handleCloseModal}>
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ width: '300px', color: '#bdbdbd' }}>Very nice modal content</div>
      </Modal>
    </Grid>
  );
};

export const ConfirmationPopup = () => {
  const { open, handleOpenModal, handleCloseModal } = useModalState();

  return (
    <Grid>
      <StyledButton onClick={handleOpenModal} variant="contained" color="primary">
        Open Dialog Large
      </StyledButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Delete File?"
        isCloseIconShowed
        actions={
          <>
            <ClearAllButton color="primary" onClick={handleCloseModal}>
              Cancel
            </ClearAllButton>

            <StyledButton variant="contained" color="primary" onClick={handleCloseModal}>
              <StyledDeleteIcon />
              Delete
            </StyledButton>
          </>
        }
      >
        <div style={{ width: '300px', color: '#bdbdbd' }}>
          <StyledText>You are about to delete the File</StyledText>
        </div>
      </Modal>
    </Grid>
  );
};

export const WithStickyFooter = ({ type }) => {
  const { open, handleOpenModal, handleCloseModal } = useModalState();
  const withScroll = type === 'With Scroll';

  return (
    <Grid>
      <StyledButton onClick={handleOpenModal} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Dialog Title"
        isCloseIconShowed
        stickyFooter
        actions={
          <Grid container direction="row-reverse" alignItems="center">
            <Button variant="contained" color="primary" onClick={handleCloseModal}>
              Save
            </Button>
            <ClearAllButton color="primary" onClick={handleCloseModal}>
              Cancel
            </ClearAllButton>
          </Grid>
        }
      >
        {!withScroll ? (
          <div style={{ width: '300px', color: '#bdbdbd' }}>
            <StyledText paragraph>Dialog Content</StyledText>
          </div>
        ) : (
          <div style={{ width: '300px', color: '#bdbdbd', marginTop: '16px' }}>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
            <StyledText paragraph>Dialog Content</StyledText>
          </div>
        )}
      </Modal>
    </Grid>
  );
};

export const WithMobileFiltersView = () => {
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
        margin: '0 16px 0 auto !important',
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
        type="filters"
        contentContainerClassName={styles.container}
        rootClassName={styles.rootClassName}
        actions={
          <>
            <ClearAllButton
              color="primary"
              onClick={handleCloseModal}
              className={styles.closeButton}
            >
              Cancel
            </ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={handleCloseModal}>
              Save
            </StyledButton>
          </>
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
            label="Show Comments for Days vs Depth/Cost"
            className={styles.checkbox}
          />
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

export const BasicDialogDimensions = () => {
  const [openSmall, setOpenSmall] = useState();
  const [openMedium, setOpenMedium] = useState();
  const [openLarge, setOpenLarge] = useState();
  const [openExtraLarge, setOpenExtraLarge] = useState();
  const [openCustom, setOpenCustom] = useState();

  const useStyles = makeStyles({ customDialog: { width: 500 } });
  const styles = useStyles();

  return (
    <Grid>
      <h3>Modal Dialog with Size small</h3>
      <StyledButton onClick={() => setOpenSmall(true)} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={openSmall}
        onClose={() => setOpenSmall(false)}
        title="Small Size Dialog"
        size="small"
        actions={
          <>
            <ClearAllButton onClick={() => setOpenSmall(false)}>Clear</ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={() => setOpenSmall(false)}>
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ color: '#bdbdbd' }}>
          Use prop{' '}
          <i>
            <b>size = &quot;small&quot;</b>
          </i>
        </div>
      </Modal>

      <h3>Modal Dialog with Size Medium</h3>
      <StyledButton onClick={() => setOpenMedium(true)} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={openMedium}
        onClose={() => setOpenMedium(false)}
        title="Medium Size Dialog"
        size="medium"
        actions={
          <>
            <ClearAllButton onClick={() => setOpenMedium(false)}>Clear</ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={() => setOpenMedium(false)}>
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ color: '#bdbdbd' }}>
          Use prop{' '}
          <i>
            <b>size = &quot;medium&quot;</b>
          </i>
        </div>
      </Modal>

      <h3>Modal Dialog with Size Large</h3>
      <StyledButton onClick={() => setOpenLarge(true)} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={openLarge}
        onClose={() => setOpenLarge(false)}
        title="Large Size Dialog"
        size="large"
        actions={
          <>
            <ClearAllButton onClick={() => setOpenLarge(false)}>Clear</ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={() => setOpenLarge(false)}>
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ color: '#bdbdbd' }}>
          Use prop{' '}
          <i>
            <b>size = &quot;large&quot;</b>
          </i>
        </div>
      </Modal>

      <h3>Modal Dialog with Size Extra-Large</h3>
      <StyledButton onClick={() => setOpenExtraLarge(true)} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={openExtraLarge}
        onClose={() => setOpenExtraLarge(false)}
        title="Extra-Large Size Dialog"
        size="extraLarge"
        actions={
          <>
            <ClearAllButton onClick={() => setOpenExtraLarge(false)}>Clear</ClearAllButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => setOpenExtraLarge(false)}
            >
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ color: '#bdbdbd' }}>
          Use prop{' '}
          <i>
            <b>size = &quot;extraLarge&quot;</b>
          </i>
        </div>
      </Modal>

      <h3>Modal Dialog with Custom Size</h3>
      <StyledButton onClick={() => setOpenCustom(true)} variant="contained" color="primary">
        Open Dialog
      </StyledButton>
      <Modal
        open={openCustom}
        onClose={() => setOpenCustom(false)}
        title="Custom Size Dialog"
        contentContainerClassName={styles.customDialog}
        actions={
          <>
            <ClearAllButton onClick={() => setOpenCustom(false)}>Clear</ClearAllButton>
            <StyledButton variant="contained" color="primary" onClick={() => setOpenCustom(false)}>
              Apply
            </StyledButton>
          </>
        }
      >
        <div style={{ color: '#bdbdbd' }}>
          Set size in class and pass it as{' '}
          <i>
            <b>contentContainerClassName</b>
          </i>{' '}
          prop
        </div>
      </Modal>
    </Grid>
  );
};
