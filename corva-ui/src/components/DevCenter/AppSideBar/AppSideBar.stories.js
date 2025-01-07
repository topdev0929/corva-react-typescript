/* eslint-disable react/prop-types */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import AppSideBarComponent from '~/components/DevCenter/AppSideBar/AppSideBar';
import SwitchControl from '~/components/SwitchControl';

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
  },
  contentWrapper: {
    display: 'flex',
    position: 'relative',
    flexGrow: 1,
    height: 'calc(100% - 36px)', // NOTE: 36px is header height
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  scrollableContent: {
    height: 1500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export const AppSideBar = ({ anchor, size, height, allOptionsButtonShown }) => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isAllOptionsSelected, setIsAllOptionsSelected] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const onChange = e => {
    setIsChecked(e.target.checked);
  };

  const onAllOptionsClick = () => {
    setIsChecked(!isAllOptionsSelected);
    setIsAllOptionsSelected(prev => !prev);
  };

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.header}>My awesome app</div>
      <div className={styles.contentWrapper}>
        {anchor === 'left' && (
          <AppSideBarComponent
            size={size}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            anchor={anchor}
            header={<span>filter</span>}
            headerIcon={<FilterListIcon />}
            allOptionsButtonShown={allOptionsButtonShown}
            isAllOptionsSelected={isAllOptionsSelected}
            onAllOptionsClick={onAllOptionsClick}
          >
            <div className={styles.scrollableContent}>
              <div>
                <SwitchControl
                  title="Switch Control with two labels"
                  leftLabel="Left"
                  rightLabel="Right"
                  color="primary"
                  checked={isChecked}
                  onChange={onChange}
                />
                <SwitchControl
                  title="Switch Control with two labels"
                  rightLabel="Right"
                  leftLabel="Left"
                  color="primary"
                  checked={isChecked}
                  onChange={onChange}
                />
              </div>
              <div>Scroll start</div>
              <div>Scroll end</div>
            </div>
          </AppSideBarComponent>
        )}
        <div className={styles.content}>
          <div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
              <br />
              <br />
            </p>
          </div>
        </div>
        {anchor === 'right' && (
          <AppSideBarComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            allOptionsButtonShown={allOptionsButtonShown}
            header={
              <>
                <span>filter</span>
              </>
            }
            headerIcon={<FilterListIcon />}
            anchor={anchor}
            size={size}
          >
            Not scrollable content
          </AppSideBarComponent>
        )}
      </div>
    </div>
  );
};

AppSideBar.storyName = 'AppSideBar';

export default {
  title: 'Components/AppSideBar',
  component: AppSideBar,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    anchor: {
      control: 'inline-radio',
      options: ['left', 'right'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
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
    allOptionsButtonShown: {
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
  args: {
    anchor: 'left',
    allOptionsButtonShown: true,
    size: 'medium',
    height: 480,
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DevCenter/AppSideBar/AppSideBar.js',
  },
};
