import { FC, useState, MouseEvent } from 'react';
import { upperCase } from 'lodash';

import { styles } from './styles';

import { CardGroup } from '@/components/common/CardGroup';
import { Card } from '@/components/common/Card';
import { ArrowIcon } from '@/components/common/ArrowIcon';
import { ArrowLineLeftSeafloor } from '@/components/common/icons/ArrowLineLeftSeafloor';
import { ArrowFourStability } from '@/components/common/icons/ArrowFourStability';
import { ArrowLineRightStability } from '@/components/common/icons/ArrowLineRightStability';
import { Popover } from '@/components/common/Popover';
import { lossOfModeTabData } from '@/constants/data.const';
import { TSource } from '@/types/global.type';

type TStabilityTab = {
  currentUser: { [key: string]: any };
  assetId: number;
};

export const StabilityTab: FC<TStabilityTab> = ({ currentUser, assetId }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [source, setSource] = useState<TSource>(lossOfModeTabData);

  const onPopover = (event: MouseEvent<HTMLDivElement>, title: string) => {
    setAnchorEl(event.target as HTMLButtonElement);
    setTitle(title);
  };

  return (
    <div data-testid="stability-tab">
      <div style={styles.preventWrapper}>
        <CardGroup title="Preventative safeguards" width="90%" padding="16px 16px 0 16px">
          <div style={{ width: '60%' }}>
            <div style={styles.flex}>
              <Card
                data-testid="vessel-impact-card"
                width="50%"
                title="Vessel Impact"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Vessel Impact'];
                  if (stabilityData) {
                    onPopover(e, 'Vessel Impact');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="50%"
                title="Bridge Resource Management"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Bridge Resource Management'];
                  if (stabilityData) {
                    onPopover(e, 'Bridge Resource Management');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="50%"
                title="Change in Weight Distribution"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Change in Weight Distribution'];
                  if (stabilityData) {
                    onPopover(e, 'Change in Weight Distribution');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="50%"
                title="Ballast Control Procedures"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Ballast Control Procedures'];
                  if (stabilityData) {
                    onPopover(e, 'Ballast Control Procedures');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="50%"
                title="Adverse Weather Conditions"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Adverse Weather Conditions'];
                  if (stabilityData) {
                    onPopover(e, 'Adverse Weather Conditions');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="50%"
                title="Ballast Control Procedures"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Ballast Control Procedures'];
                  if (stabilityData) {
                    onPopover(e, 'Ballast Control Procedures');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="50%"
                title="Corrosion / Fatigue"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Corrosion / Fatigue'];
                  if (stabilityData) {
                    onPopover(e, 'Corrosion / Fatigue');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="50%"
                title="Maintenance & Inspections"
                source={source}
                onClick={e => {
                  const stabilityData = lossOfModeTabData['Maintenance & Inspections'];
                  if (stabilityData) {
                    onPopover(e, 'Maintenance & Inspections');
                  }
                }}
              />
            </div>
          </div>
          <ArrowFourStability />
          <Card
            width="25%"
            title="Vessel Selection"
            source={source}
            onClick={e => {
              const stabilityData = lossOfModeTabData['Vessel Selection'];
              if (stabilityData) {
                onPopover(e, 'Vessel Selection');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="25%"
            title="Watertight Integrity"
            source={source}
            onClick={e => {
              const stabilityData = lossOfModeTabData['Watertight Integrity'];
              if (stabilityData) {
                onPopover(e, 'Watertight Integrity');
              }
            }}
          />
        </CardGroup>
      </div>
      <div style={styles.unControlled}>
        <ArrowLineLeftSeafloor
          color="#BDBDBD"
          style={{ position: 'absolute', top: '530px', left: '35px' }}
        />
        <Card
          data-testid="uncontrolled-hc-card"
          width="60%"
          title={upperCase('Uncontrolled HC Release to Rig Floor')}
          source={source}
          onClick={e => {
            const stabilityData = lossOfModeTabData['Uncontrolled HC Release to Rig Floor'];
            if (stabilityData) {
              onPopover(e, 'Uncontrolled HC Release to Rig Floor');
            }
          }}
        />
        <ArrowLineRightStability
          color="#BDBDBD"
          style={{ position: 'absolute', top: '320px', right: '90px', zIndex: '-1' }}
        />
      </div>
      <div style={styles.mitigateWrapper}>
        <CardGroup title="Mitigative safeguards" width="100%" padding="30px 16px 22px 16px">
          <Card
            width="50%"
            title="Vessel ER Procedures"
            source={source}
            onClick={e => {
              const stabilityData = lossOfModeTabData['Vessel ER Procedures'];
              if (stabilityData) {
                onPopover(e, 'Vessel ER Procedures');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="50%"
            title="Muster / Abandon"
            source={source}
            onClick={e => {
              const stabilityData = lossOfModeTabData['Muster / Abandon'];
              if (stabilityData) {
                onPopover(e, 'Muster / Abandon');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            data-testid="search-rescue-id"
            width="50%"
            title="Search & Rescue"
            source={source}
            onClick={e => {
              const stabilityData = lossOfModeTabData['Search & Rescue'];
              if (stabilityData) {
                onPopover(e, 'Search & Rescue');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            data-testid="fatalities-card"
            width="50%"
            title="Fatalities"
            source={source}
            onClick={e => {
              // eslint-disable-next-line dot-notation
              const stabilityData = lossOfModeTabData['Fatalities'];
              if (stabilityData) {
                onPopover(e, 'Fatalities');
              }
            }}
          />
        </CardGroup>
      </div>
      {title && (
        <Popover
          title={title}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setSource={setSource}
          source={source}
          data-testid="stability-popover"
          currentUser={currentUser}
          assetId={assetId}
        />
      )}
    </div>
  );
};
