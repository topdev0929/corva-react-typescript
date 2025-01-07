/* eslint-disable react/prop-types */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { OffsetWellChip, OffsetWellChipsContainer, AppHeader, OffsetWellButton } from '~components';

const wells = [
  {
    title: 'SubjectWellNaoo 11 12391230 1 1239123 2 11999 000 TX',
    wellId: 0,
    rigName: 'Test 123',
    isSubject: true,
  },
  {
    title: 'Polar Bear 888-00PB pBear 888-00PB',
    wellId: 1,
    rigName: 'Test 123',
    isSubject: false,
  },
  {
    title: 'Dingo Dog LX JOIY 123 12 312 123  89 2983 888-00PB',
    wellId: 2,
    isSubject: false,
    rigName: 'Test 123',
    markColor: '#93FEE4',
  },
  {
    title: 'New Orleans 56-DR',
    wellId: 3,
    isSubject: false,
    rigName: 'Test 123',
  },
  {
    title: 'Polar Bear 888-00PB pBear 888-00PB',
    wellId: 4,
    isSubject: false,
    rigName: 'Test 123',
  },
  {
    title: 'Dingo Dog LX JOIY  123 123 123123 89 2983 888-00PB',
    wellId: 5,
    isSubject: false,
    rigName: 'Test 123',
    markColor: '#D7D260',
  },
];

const appHeaderProps = {
  app: {
    id: -1,
    app: {
      platform: 'dev_center',
    },
    settings: {
      package: '0.0.38',
      rigId: 700,
      wellId: null,
    },
    package: {
      manifest: {
        application: {
          type: 'ui',
          key: 'test-app.ui',
          visibility: 'private',
          name: 'DC Test App',
          subtitle: 'App to show way to work with offsetWells',
          category: 'rigActivity',
          segments: ['drilling'],
        },
      },
      version: '0.0.38',
    },
  },

  coordinates: {
    x: 0,
    y: 0,
    w: 8,
    h: 15,
    pixelHeight: 590,
    pixelWidth: 978,
  },
  isMaximized: false,
  rig: {
    name: '000 Fav test',
    id: '700',
    asset_id: 83735074,
  },
};

const useStyles = makeStyles(() => ({
  appContainer: {
    padding: '12px 12px 30px 12px',
  },
}));

export const Chips = ({ maxWidth, handleRemoveOffsetWell }) => {
  return (
    <>
      <div>Chips</div>
      <OffsetWellChipsContainer
        wells={wells}
        maxWidth={maxWidth}
        onRemoveOffsetWell={handleRemoveOffsetWell}
      />
    </>
  );
};

export const ChipsWithAppHeader = ({ maxWidth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useStyles();
  const [offsetWells, setOffsetWells] = useState(wells);
  const onExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOffsetClick = () => {
    // eslint-disable-next-line no-alert
    alert('Here you can add modal to Add/Edit offset wells');
  };

  const handleRemoveOffsetWell = wellId => {
    setOffsetWells(offsetWells.filter(well => well.wellId !== wellId));
  };

  return (
    <div className={styles.appContainer}>
      <AppHeader {...appHeaderProps}>
        <OffsetWellButton
          onExpand={onExpand}
          expanded={isExpanded}
          wells={offsetWells}
          onClick={handleOffsetClick}
        />
      </AppHeader>
      {isExpanded && (
        <OffsetWellChipsContainer
          wells={offsetWells}
          maxWidth={maxWidth}
          onRemoveOffsetWell={handleRemoveOffsetWell}
        />
      )}
    </div>
  );
};

export default {
  title: 'Components/OffsetWellChips',
  component: Chips,
  subcomponents: { OffsetWellChip },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/OffsetWellChips/Chip/index.js',
  },
  argTypes: {
    maxWidth: {
      type: { required: true },
      control: 'number',
    },
  },
  args: {
    maxWidth: 200,
  },
};
