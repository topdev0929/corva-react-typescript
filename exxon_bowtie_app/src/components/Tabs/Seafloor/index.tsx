import { FC, useState, MouseEvent } from 'react';
import { upperCase } from 'lodash';

import { styles } from './styles';

import { CardGroup } from '@/components/common/CardGroup';
import { Card } from '@/components/common/Card';
import { ArrowIcon } from '@/components/common/ArrowIcon';
import { ArrowLineLeftSeafloor } from '@/components/common/icons/ArrowLineLeftSeafloor';
import { ArrowLineRightSeafloor } from '@/components/common/icons/ArrowLineRightSeafloor';
import { One2ThreeSeafloor } from '@/components/common/icons/One2ThreeSeafloor';
import { Popover } from '@/components/common/Popover';
import { seafloorTabData } from '@/constants/data.const';
import { TSource } from '@/types/global.type';

type TSeafloorTab = {
  currentUser: { [key: string]: any };
  assetId: number;
};

export const SeafloorTab: FC<TSeafloorTab> = ({ currentUser, assetId }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [source, setSource] = useState<TSource>(seafloorTabData);

  const onPopover = (event: MouseEvent<HTMLDivElement>, title: string) => {
    setAnchorEl(event.target as HTMLButtonElement);
    setTitle(title);
  };

  return (
    <div data-testid="seafloor-tab">
      <div style={styles.preventWrapper}>
        <CardGroup title="Preventative safeguards" width="70%" padding="12px 16px 0px 16px">
          <div>
            <div style={styles.flex}>
              <Card
                data-testid="riser-card"
                width="166px"
                title="Riser Failure"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['Riser Failure'];
                  if (seafloorData) {
                    onPopover(e, 'Riser Failure');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                data-testid="riser-integrity-id"
                width="166px"
                title="Riser Integrity"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['Riser Integrity'];
                  if (seafloorData) {
                    onPopover(e, 'Riser Integrity');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="166px"
                title="Loss Of Position"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['Loss Of Position'];
                  if (seafloorData) {
                    onPopover(e, 'Loss Of Position');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="166px"
                title="DP/PM System"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['DP/PM System'];
                  if (seafloorData) {
                    onPopover(e, 'DP/PM System');
                  }
                }}
              />
            </div>
            <div style={styles.flex}>
              <Card
                width="166px"
                title="Planned Disconnect"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['Planned Disconnect'];
                  if (seafloorData) {
                    onPopover(e, 'Planned Disconnect');
                  }
                }}
              />
              <ArrowIcon direction="right" />
              <Card
                width="166px"
                title="Suspension Barriers"
                source={source}
                onClick={e => {
                  const seafloorData = seafloorTabData['Suspension Barriers'];
                  if (seafloorData) {
                    onPopover(e, 'Suspension Barriers');
                  }
                }}
              />
            </div>
          </div>
          <One2ThreeSeafloor color="#9E9E9E" />
          <Card
            width="25%"
            title="Emergency Disconnect"
            source={source}
            onClick={e => {
              const seafloorData = seafloorTabData['Emergency Disconnect'];
              if (seafloorData) {
                onPopover(e, 'Emergency Disconnect');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="25%"
            title="BOP Equipment"
            source={source}
            onClick={e => {
              const seafloorData = seafloorTabData['BOP Equipment'];
              if (seafloorData) {
                onPopover(e, 'BOP Equipment');
              }
            }}
          />
        </CardGroup>
      </div>
      <div style={styles.unControlled}>
        <ArrowLineLeftSeafloor
          color="#BDBDBD"
          style={{ position: 'absolute', top: '490px', left: '35px' }}
        />
        <Card
          data-testid="uncontrolled-hc-card"
          width="60%"
          title={upperCase('Uncontrolled HC Release to Rig Floor')}
          source={source}
          onClick={e => {
            const seafloorData = seafloorTabData['Uncontrolled HC Release to Rig Floor'];
            if (seafloorData) {
              onPopover(e, 'Uncontrolled HC Release to Rig Floor');
            }
          }}
        />
        <ArrowLineRightSeafloor
          color="#BDBDBD"
          style={{ position: 'absolute', top: '312px', right: '90px', zIndex: '-1' }}
        />
      </div>
      <div style={styles.mitigateWrapper}>
        <CardGroup title="Mitigative safeguards" width="45%" padding="30px 16px 22px 16px">
          <Card
            data-testid="emergency-well-card"
            width="45%"
            title="Emergency Well Report"
            source={source}
            onClick={e => {
              const seafloorData = seafloorTabData['Emergency Well Report'];
              if (seafloorData) {
                onPopover(e, 'Emergency Well Report');
              }
            }}
          />
          <ArrowIcon direction="right" />
          <Card
            width="45%"
            title="Extended Environmental"
            source={source}
            onClick={e => {
              const seafloorData = seafloorTabData['Extended Environmental'];
              if (seafloorData) {
                onPopover(e, 'Extended Environmental');
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
          data-testid="seafloor-popover"
          currentUser={currentUser}
          assetId={assetId}
        />
      )}
    </div>
  );
};
