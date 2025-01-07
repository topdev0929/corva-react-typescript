import { FC, useState, MouseEvent } from 'react';
import { upperCase } from 'lodash';

import { styles } from './styles';

import { CardGroup } from '@/components/common/CardGroup';
import { Card } from '@/components/common/Card';
import { ArrowIcon } from '@/components/common/ArrowIcon';
import { ArrowLineLeft } from '@/components/common/icons/ArrowLineLeft';
import { ArrowLineRight } from '@/components/common/icons/ArrowLineRight';
import { One2Three } from '@/components/common/icons/One2Three';
import { Popover } from '@/components/common/Popover';
import { TSource } from '@/types/global.type';
import { surfaceTabData } from '@/constants/data.const';

type TSurfaceTab = {
  currentUser: { [key: string]: any };
  assetId: number;
};

export const SurfaceTab: FC<TSurfaceTab> = ({ currentUser, assetId }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [source, setSource] = useState<TSource>(surfaceTabData);

  const onPopover = (event: MouseEvent<HTMLDivElement>, title: string) => {
    setAnchorEl(event.target as HTMLButtonElement);
    setTitle(title);
  };

  return (
    <div data-testid="surface-tab">
      <div style={styles.preventWrapper}>
        <CardGroup title="Preventative safeguards" padding="32px 16px 16px 16px">
          <Card
            width="15%"
            title="Influx Below BOP"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Influx Below BOP'];
              if (surfaceData) {
                onPopover(e, 'Influx Below BOP');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            data-testid="influx-id"
            width="15%"
            title="Influx ID"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Influx ID'];
              if (surfaceData) {
                onPopover(e, 'Influx ID');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="15%"
            title="Shut In"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Shut In'];
              if (surfaceData) {
                onPopover(e, 'Shut In');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="15%"
            title="BOP Equipment"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['BOP Equipment'];
              if (surfaceData) {
                onPopover(e, 'BOP Equipment');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="15%"
            title="Diverter"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData.Diverter;
              if (surfaceData) {
                onPopover(e, 'Diverter');
              }
            }}
          />
        </CardGroup>
      </div>
      <div style={styles.unControlled}>
        <ArrowLineLeft
          color="#BDBDBD"
          style={{ position: 'absolute', top: '325px', left: '28px' }}
        />
        <Card
          width="63%"
          title={upperCase('Uncontrolled HC Release to Rig Floor')}
          source={source}
          onClick={e => {
            const surfaceData = surfaceTabData['Uncontrolled HC Release to Rig Floor'];
            if (surfaceData) {
              onPopover(e, 'Uncontrolled HC Release to Rig Floor');
            }
          }}
        />
        <ArrowLineRight
          color="#BDBDBD"
          style={{ position: 'absolute', top: '212px', right: '28px', zIndex: '-1' }}
        />
      </div>
      <div style={styles.mitigateWrapper}>
        <CardGroup title="Mitigative safeguards" padding="0 16px">
          <Card
            width="15%"
            title="Gas Alarms"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Gas Alarms'];
              if (surfaceData) {
                onPopover(e, 'Gas Alarms');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="15%"
            title="Ignition Control"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Ignition Control'];
              if (surfaceData) {
                onPopover(e, 'Ignition Control');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="15%"
            title="Emergency Disconnect"
            source={source}
            onClick={e => {
              const surfaceData = surfaceTabData['Emergency Disconnect'];
              if (surfaceData) {
                onPopover(e, 'Emergency Disconnect');
              }
            }}
          />
          <One2Three color="#9E9E9E" />
          <div style={{ width: '40%' }}>
            <div style={styles.flex}>
              <Card
                width="166px"
                title="Fire Water System"
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Fire Water System'];
                  if (surfaceData) {
                    onPopover(e, 'Fire Water System');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="166px"
                title="Muster / Abandon"
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Muster / Abandon'];
                  if (surfaceData) {
                    onPopover(e, 'Muster / Abandon');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="166px"
                title="Additional Fatalities"
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Additional Fatalities'];
                  if (surfaceData) {
                    onPopover(e, 'Additional Fatalities');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="192px"
                title="Emergency Well Response"
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Emergency Well Response'];
                  if (surfaceData) {
                    onPopover(e, 'Emergency Well Response');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="192px"
                title="Extended Environmental "
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Extended Environmental'];
                  if (surfaceData) {
                    onPopover(e, 'Extended Environmental');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="215px"
                title="Immediate Area Fatalities"
                source={source}
                onClick={e => {
                  const surfaceData = surfaceTabData['Immediate Area Fatalities'];
                  if (surfaceData) {
                    onPopover(e, 'Immediate Area Fatalities');
                  }
                }}
              />
            </div>
          </div>
        </CardGroup>
      </div>
      {title && (
        <Popover
          title={title}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setSource={setSource}
          source={source}
          data-testid="surface-popover"
          currentUser={currentUser}
          assetId={assetId}
        />
      )}
    </div>
  );
};
