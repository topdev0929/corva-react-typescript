/* eslint-disable react/prop-types */

import { FormControlLabel, Checkbox, withStyles, makeStyles } from '@material-ui/core';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import AppSettingsPopoverComponent from '~/components/DevCenter/AppSettingsPopover';
import * as Typography from '~/components/Typography';

const useStyles = makeStyles({
  settingsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#202020',
    height: 480,
    padding: 12,
  },
  settingsContent: {
    padding: '0 16px 16px 16px',
  },
});

const StyledText16 = withStyles({ root: { marginBottom: 12 } })(Typography.Regular16);

const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

export const AppSettingsPopover = props => {
  const styles = useStyles();

  return (
    <div className={styles.settingsWrapper}>
      <AppSettingsPopoverComponent {...props.muiPopoverProps}>
        <div className={styles.settingsContent}>
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
        </div>
      </AppSettingsPopoverComponent>
    </div>
  );
};

AppSettingsPopover.storyName = 'App Settings Popover';

export const ScrollableAppSettingsPopover = props => {
  const styles = useStyles({ height: 480 });

  return (
    <div className={styles.settingsWrapper}>
      <AppSettingsPopoverComponent {...props.muiPopoverProps} defaultScrollable maxHeight={480}>
        <div className={styles.settingsContent}>
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
            label="BHA#"
          />
          <FormControlLabel
            size="medium"
            spacing="normal"
            direction="vertical"
            control={<StyledCheckbox size="medium" />}
            label="BHA Schematic"
          />
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
        </div>
      </AppSettingsPopoverComponent>
    </div>
  );
};

export default {
  title: 'Components/App Settings',
  component: AppSettingsPopoverComponent,
  argTypes: {
    muiPopoverProps: {
      name: '...muiPopoverProps',
      description:
        '<a href="https://v4.mui.com/api/popover/#popover-api" target="_blank">MUI Popover API</a>',
      table: {
        type: { summary: 'object' },
      },
      control: {
        type: 'object',
      },
    },
  },
  args: {
    table: { summary: '{}' },
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DevCenter/AppSettingsPopover/AppSettingsPopover.js',
  },
};
