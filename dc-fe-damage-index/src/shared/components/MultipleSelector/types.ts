export type Option<Value> = {
  value: Value;
  label: string;
  suffix?: string;
};

export type DropdownFilterProps<Value> = {
  label: string;
  disabled?: boolean;
  filterKey: string;
  options: Option<Value>[];
  value: Value[];
  handleChange: (value: Value[]) => void;
};
