export type Option<Value> = {
  value: Value;
  label: string;
  icon?: string;
  suffix?: string;
};

type CommonSelectorProps<Value> = {
  id: string;
  label: string;
  options: Option<Value>[];
  disabled?: boolean;
  testId?: string;
  multiple?: boolean;
  className?: string;
};

type SingleSelectorProps<Value> = CommonSelectorProps<Value> & {
  value: Value | null;
  handleChange: (value: Value) => void;
  multiple?: false;
};

type MultipleSelectorProps<Value> = CommonSelectorProps<Value> & {
  value: Value[];
  handleChange: (values: Value[]) => void;
  multiple: true;
};

export type SelectorProps<Value> = SingleSelectorProps<Value> | MultipleSelectorProps<Value>;
