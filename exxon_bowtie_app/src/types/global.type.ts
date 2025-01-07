import { Dispatch, SetStateAction } from 'react';

export enum Status {
  Info = 'info',
  Critical = 'critical',
  Medium = 'medium',
  Done = 'done',
}

export type TSubdata = { header: string; content: Date }[] | [];

export type TComment = { status: Status; title: string; description: string; time: Date };

export type TChip = {
  label: string;
  pvtIndexes: number[];
  status: Status;
  subData: TSubdata;
  comments: TComment[];
};

export type TSource = {
  [key: string]: {
    chips: TChip[];
    commentTabs: string[];
  };
};

export type TPopoverProps = {
  title: string;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement>>;
  source?: TSource;
  setSource?: (data: TSource) => void;
  assetId: number;
  currentUser: {
    [key: string]: any;
  };
};

export type TTabsHeader = {
  tabIndex: number;
  setTabIndex: (index: number) => void;
};

export type TTabs = {
  tabIndex: number;
  assetId: number;
  currentUser: {
    [key: string]: any;
  };
};
