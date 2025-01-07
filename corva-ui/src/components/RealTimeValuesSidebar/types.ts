export type RealTimeType = {
  name: string;
  key: string;
  unitType?: string;
  unit?: string;
  color?: string;
  precision?: number;
  category?: string;
  collection?: string;
};

export type RealTimeBoxEditDialogProps = {
  isDialogOpen: boolean;
  paramToEdit: string;
  handleCloseRealTimeDialog: () => void;
};

export type Theme = {
  isLightTheme: boolean;
};

export type RealtimeSidebarProps = {
  theme: Theme;
  isResponsive: boolean;
  isSidebarOpen: boolean;
  handleOpenCloseSidebar: (isOpen: boolean) => void;
  onAppSettingChange: (key: string, value: any) => void;
  appSettings: Record<string, any>;
  assetKey: string;
  setting: string[];
  realTimeTypes: RealTimeType[];
  isDialogOpen: boolean;
  paramToEdit: string;
  handleOpenCloseDialog: (isOpen: boolean) => void;
  sourceArray: any[];
  findSource: (param: string, realTimeTypes: RealTimeType[]) => any;
  handleChangeParamToEdit: (item: string) => void;
  sidebarHorizontalHeight?: number;
  onLayoutChange?: (height: number) => void;
};

export type RealTimeBoxItem = {
  name: string;
  value: string | number;
  key: string;
  color: string;
  unitType: string;
};

export type RealTimeBoxProps = {
  item?: RealTimeBoxItem;
  itemSelected?: number;
  dragHandle?: (param: JSX.Element) => void;
  isDraggable?: boolean;
  handleClick?: () => void;
};

export type RealTimeBoxListProps = {
  sourceArray: any[];
  findSource: (param: string, realTimeTypes: RealTimeType[]) => any;
};

export type SidebarFooterProps = {
  onSidebarOpened: () => void;
  onSidebarClosed: () => void;
};
