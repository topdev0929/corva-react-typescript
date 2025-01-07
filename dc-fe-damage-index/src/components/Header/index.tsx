import { useCallback, useState } from 'react';
import { AppSettingsPopover } from '@corva/ui/components';
import { FormControlLabel, Switch, Typography, Button } from '@material-ui/core';
import { useGlobalStore } from '@/contexts/global';
import { useDIChartStore } from '@/contexts/di-chart';
import { SCREEN_BREAK_POINTS, SCALE_TYPE, DEFAULT_SCALE } from '@/constants';

import { Filters } from './Filters';
import { WellInfo } from './WellInfo';
import { Scale } from './Scale';
import styles from './index.module.css';

export const Header = () => {
  const globalStore = useGlobalStore();
  const diChartStore = useDIChartStore();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(diChartStore.autoScale);
  const [scales, setScales] = useState(diChartStore.scales);

  const handleSwitch = useCallback((e) => {
    setChecked(e.target.checked);
    if (e.target.checked) setScales(DEFAULT_SCALE);
    diChartStore.setAutoScale(e.target.checked);
  }, [setChecked, diChartStore]);

  const handleOpen = () => {
    setOpen(!open);
    setScales(diChartStore.scales);
  }

  const handleSave = () => {
    setOpen(false);
    diChartStore.setScales(scales);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Filters />
        {globalStore.appSize.width > SCREEN_BREAK_POINTS.TABLET_SM && <WellInfo />}
        <div onClick={handleOpen} className={styles.settings}>
          <AppSettingsPopover open={open}>
            <div className={styles.settingsContent} onClick={(e) => e.stopPropagation()}>
              <Typography className={styles.settingsTitle}>Damage Index</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    size="medium"
                    onChange={handleSwitch}
                    color="primary"
                  />
                }
                label="Auto Scale"
              />
              <Scale disabled={checked} label="Low Damage Index" scale={scales} setScale={setScales} type={SCALE_TYPE.LOW} />
              <Scale disabled={checked} label="Medium Damage Index" scale={scales} setScale={setScales} type={SCALE_TYPE.MEDIUM}  />
              <Scale disabled={checked} label="High Damage Index" scale={scales} setScale={setScales} type={SCALE_TYPE.HIGH}  />
              <div className={styles.btnWrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </AppSettingsPopover>
        </div>
      </div>
    </div>
  );
};
