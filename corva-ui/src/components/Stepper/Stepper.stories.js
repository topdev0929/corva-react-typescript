import { useState } from 'react';

import { Grid, Button, styled } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import Modal from '~/components/Modal';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { Stepper, Step } from '~/components/Stepper';

const StyledArrowBackIcon = styled(ArrowBack)({ marginRight: 6 });

export const Steps = () => {
  return (
    <>
      <div>Steps</div>
      <div style={{ width: '100%', padding: 16 }}>
        <Step value={1} />
        <Step value={2} label="Second step" />
        <Step value={3} label="Checked Step" checked />
        <Step value={4} label="Active Step" active />
        <Step value={5} label="Error Step" error />
        <Step value={6} label="Active Error Step" active error />
        <Step value={7} label="Active Checked Step" active checked />
        <Step
          value={8}
          label="Active Checked Step without return to prev"
          active
          checked
          canGoBack={false}
        />
        <Step value={9} label="Inactive step" disabled />
      </div>
    </>
  );
};

Steps.parameters = {
  controls: {
    hideNoControlsWarning: true,
  },
};

export const StepsWizard = props => {
  const [activeStep, setActiveStep] = useState(1);
  const goToNextStep = () => setActiveStep(activeStep + 1);
  const goBack = () => setActiveStep(activeStep - 1);

  return (
    <Modal
      open
      title="Steps Wizard"
      stickyFooter
      actions={
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Button color="primary" onClick={goBack} disabled={activeStep === 1}>
            <StyledArrowBackIcon />
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={goToNextStep}
            disabled={activeStep === 4}
          >
            Next
          </Button>
        </Grid>
      }
    >
      <div style={{ paddingBottom: 40, maxWidth: 800 }}>
        <Stepper
          activeStep={activeStep}
          size="large"
          steps={[
            { value: 1, label: 'First step' },
            { value: 2, label: 'Second Step', canGoBack: false },
            { value: 3, label: 'Step with error', error: true },
            { value: 4, label: 'Last step' },
          ]}
          {...props}
        />
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry standard dummy text ever since the 1500s, when an unknown printer took a
          galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </div>
      </div>
    </Modal>
  );
};

export default {
  title: 'Components/Stepper',
  component: Stepper,
  subcomponents: { Step },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Stepper/index.js',
  },
};
