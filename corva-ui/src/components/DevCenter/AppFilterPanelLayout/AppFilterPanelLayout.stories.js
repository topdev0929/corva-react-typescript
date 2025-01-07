/* eslint-disable react/prop-types */
import { useState } from 'react';
import { makeStyles, Box, withStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import Button from '~/components/Button';
import { AppFilterPanelLayout as AppFilterPanelLayoutComponent } from './AppFilterPanelLayout';
import * as Typography from '~/components/Typography';
import { ISOLATED_PAGE_APP_CONTAINER_ID } from '../IsolatedDevCenterAppContainer/constants';

const StyledText16 = withStyles({ root: { marginBottom: 12 } })(Typography.Regular16);

const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

const useSideBarStyles = makeStyles({
  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const SideBarContent = ({ isScrollable }) => {
  const styles = useSideBarStyles();

  return isScrollable ? (
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
  ) : (
    'Not scrollable content'
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 12,
    backgroundColor: '#202020',
  },
  header: {
    height: 36,
    paddingLeft: 12,
    flexShrink: 0,
  },
  content: {
    height: 'calc(100% - 36px)',
  },
});

export const AppFilterPanelLayout = ({ size, height }) => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container} style={{ height }} id={ISOLATED_PAGE_APP_CONTAINER_ID}>
      <div className={styles.header}>My awesome app</div>
      <div className={styles.content}>
        <AppFilterPanelLayoutComponent
          sideBarProps={{
            size,
            isOpen,
            setIsOpen,
            header: <span>filter</span>,
            headerIcon: <FilterListIcon />,
            onAllOptionsClick: () => {},
          }}
          sideBarContent={<SideBarContent isScrollable />}
          header={
            <Box alignItems="center" justifyContent="flex-end" flexGrow={1} display="flex">
              <Button variation="primary">Save (10)</Button>
            </Box>
          }
          appSettingsPopoverProps={{
            defaultScrollable: true,
            maxHeight: 480,
          }}
        >
          <div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
              <br />
              <br />
            </p>
          </div>
        </AppFilterPanelLayoutComponent>
      </div>
    </div>
  );
};

AppFilterPanelLayout.storyName = 'Browser Responsive';

export default {
  title: 'Components/AppSideBar',
  component: AppFilterPanelLayout,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    height: {
      description: 'Controls app width in px.',
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 480 },
      },
    },
  },
  args: {
    height: 480,
    size: 'medium',
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DevCenter/AppFilterPanelLayout/AppFilterPanelLayout.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=36138%3A142807&t=32BJCtpjZ0hjPuQB-0',
  },
};
