/* eslint-disable react/prop-types */
import { makeStyles } from '@material-ui/core';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { AppHeader, AssetStatusBadge, OffsetWellButton } from '~/components';
import { SEGMENTS } from '~/constants/segment';

import logo from './logo.png';

const getPackage = (segment = SEGMENTS.COMPLETION) => ({
  manifest: {
    application: {
      name: 'App name',
      subtitle: 'Completion Parameter Recommendation',
      segments: [segment],
    },
  },
  version: '1.0.0',
});

const commonAppHeaderProps = {
  onSettingChange: () => {},
  coordinates: { pixelWidth: 1024 },
};

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: '#201f1f',
    padding: 12,
    marginBottom: 16,
    '& a': {
      display: 'flex !important',
    },
  },
  label: {
    color: '#BDBDBD',
    fontSize: 12,
    marginBottom: 8,
  },
});

export const Default = () => {
  const classes = useStyles();

  return (
    <>
      <h2>General dashboard</h2>
      <h3>Completion segment</h3>

      <div className={classes.label}>With selected FracFleet</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: getPackage(),
            settings: { fracFleetId: 'frac fleet id', padId: 43 },
          }}
          appSettings={{ fracFleetId: 'frac fleet id' }}
          fracFleet={{
            name: 'Frac Fleet name',
            current_pad_id: 42,
            pad_frac_fleets: [{ pad: { id: 43, name: 'Historical pad name' } }],
          }}
          wells={[]}
        />
      </div>

      <div className={classes.label}>With selected historical Pad</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: getPackage(),
            settings: { fracFleetId: 'frac fleet id', padId: 42 },
          }}
          fracFleet={{
            name: 'Frac Fleet name',
            current_pad_id: 42,
            pad_frac_fleets: [{ pad: { id: 42, name: 'Pad name' } }],
          }}
          wells={[]}
          appSettings={{ fracFleetId: 'frac fleet id' }}
        />
      </div>

      <h3>Drilling segment</h3>
      <h5>
        <i>
          NOTE: Offset Well Selector is not a part of the AppHeader component but could be passed as
          children
        </i>
      </h5>

      <div className={classes.label}>Without label and selected well</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: getPackage(SEGMENTS.DRILLING),
            settings: { rigId: 'rig id' },
          }}
          rig={{ name: 'Rig name' }}
        >
          <OffsetWellButton onExpand={() => {}} expanded={false} wells={[]} onClick={() => {}} />
        </AppHeader>
      </div>

      <div className={classes.label}>With logo</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: getPackage(SEGMENTS.DRILLING),
            settings: { rigId: 'rig id' },
          }}
          rig={{ name: 'Rig name' }}
          logoSrc={logo}
        >
          <OffsetWellButton onExpand={() => {}} expanded={false} wells={[]} onClick={() => {}} />
        </AppHeader>
      </div>

      <div className={classes.label}>With PROD label</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: { ...getPackage(SEGMENTS.DRILLING), label: 'PROD' },
            settings: { wellId: 'well id' },
          }}
          rig={{ name: 'Very looooooooooooooooooooooooooooooong rig name' }}
          well={{ name: 'Very looooooooooooooooooooooooooooooong well name' }}
        >
          <OffsetWellButton onExpand={() => {}} expanded={false} wells={[]} onClick={() => {}} />
        </AppHeader>
      </div>

      <h2>Asset dashboard</h2>
      <h3>Completion segment</h3>

      <div className={classes.label}>Default with Beta label</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: { ...getPackage(), label: 'Beta' },
            settings: {},
          }}
          well={{ name: 'Well name', id: 4200 }}
        />
      </div>

      <div className={classes.label}>With well status badge</div>
      <div className={classes.wrapper}>
        <AppHeader
          {...commonAppHeaderProps}
          app={{
            package: { ...getPackage(), label: 'Beta' },
            settings: {},
          }}
          well={{ name: 'Well name', id: 4200 }}
          primaryAssetStatusBadge={<AssetStatusBadge text="frac" />}
        />
      </div>
    </>
  );
};

export default {
  title: 'Components/AppHeader',
  component: AppHeader,
  argTypes: {},
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/DevCenter/AppHeader/AppHeader.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?type=design&node-id=20186-86586&t=dpmyoDTafwPDvFsN-0',
  },
};
