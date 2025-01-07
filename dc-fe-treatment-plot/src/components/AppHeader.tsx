import { useState, Fragment, FunctionComponent } from 'react';
import { cloneDeep, get } from 'lodash';

import { makeStyles } from '@material-ui/core';
// @ts-ignore
import { AppHeader, OffsetWellButton, PadOffsetsPickerV2 } from '@corva/ui/components';
import { StagesSelector } from '@corva/ui/components/PadOffsetsPicker';

import { useAppContext } from '@/context/AppContext';
import { OffsetWell, FracFleet, Well } from '@/types/Asset';

type AppHeaderContainerProps = {
  appHeaderProps: {
    fracFleet: FracFleet;
    wells: Well[];
    well: Well;
    appSettings: {
      [key: string]: any;
    };
    app: {
      [key: string]: any;
    };
  };
  appOffsetSetting: OffsetWell[];
  onAppOffsetSettingChange: (wells: OffsetWell[]) => void;
};

const useStyles = makeStyles({
  headerWrapper: {
    padding: '0 12px 8px 12px',
  },
});

const getFormattedAppProp = (app, isAssetViewer: boolean) => {
  if (isAssetViewer) {
    const appClone = cloneDeep(app);
    const currentName = appClone?.package?.manifest?.application?.name;
    if (currentName) {
      appClone.package.manifest.application.name = `${currentName} | Viewer`;
    }
    return appClone;
  }

  return app;
};

const AppHeaderContainer: FunctionComponent<AppHeaderContainerProps> = ({
  appHeaderProps,
  appOffsetSetting,
  onAppOffsetSettingChange,
}) => {
  const classes = useStyles();
  const { isAssetViewer } = useAppContext();
  const { fracFleet, wells, well, appSettings } = appHeaderProps;
  const [isOffsetWellListExpanded, setIsOffsetWellListExpanded] = useState(false);
  const [isOffsetsPickerOpened, setIsOffsetsPickerOpened] = useState(false);

  let companyId;

  if (fracFleet) {
    const selectedPadId = fracFleet.current_pad_id || appSettings?.padId;
    const selectedPad = fracFleet.pad_frac_fleets.find(({ pad }) => pad.id === selectedPadId)?.pad;
    companyId = get(selectedPad, 'company_id');
  } else if (well) {
    companyId = get(well, ['companyId']);
  }

  const handleUpdateOffset = updatedOffset => {
    let newOffsetSetting = appOffsetSetting.filter(
      item => item.selectedWellId !== updatedOffset.selectedWellId
    );
    newOffsetSetting = [...newOffsetSetting, updatedOffset];

    onAppOffsetSettingChange(newOffsetSetting);
  };

  const handleDeleteOffset = offset => {
    const newOffsetSetting = appOffsetSetting.filter(
      item => item.selectedWellId !== offset.selectedWellId
    );

    onAppOffsetSettingChange(newOffsetSetting);
  };

  return (
    <div className={classes.headerWrapper}>
      {/* @ts-ignore */}
      <AppHeader {...appHeaderProps} app={getFormattedAppProp(appHeaderProps.app, isAssetViewer)}>
        {!isAssetViewer && (
          <OffsetWellButton
            expanded={isOffsetWellListExpanded}
            wells={appOffsetSetting}
            onExpand={() => setIsOffsetWellListExpanded(!isOffsetWellListExpanded)}
            onClick={() => setIsOffsetsPickerOpened(true)}
          />
        )}
      </AppHeader>
      <PadOffsetsPickerV2
        opened={isOffsetsPickerOpened}
        companyId={companyId}
        assets={wells || [well]}
        currentOffsetSetting={appOffsetSetting}
        onSave={onAppOffsetSettingChange}
        onClose={() => setIsOffsetsPickerOpened(false)}
      />
      {isOffsetWellListExpanded && (
        <Fragment>
          {appOffsetSetting.map(offset => (
            <StagesSelector
              key={offset.selectedWellId}
              offset={offset}
              onDelete={() => handleDeleteOffset(offset)}
              onSave={handleUpdateOffset}
            />
          ))}
        </Fragment>
      )}
    </div>
  );
};

export default AppHeaderContainer;
