import { MultipleSelector, Option } from '@/shared/components/MultipleSelector';

type Props<Value> = {
  label: string;
  value: Value[];
  onChange: (value: Value[]) => void;
  options: Option<Value>[];
  loading: {
    is: boolean;
    label: string;
  };
  filterKey: string;
};

export function CommonFilterSelector<Value extends string | number>({
  label,
  value,
  options,
  loading,
  onChange,
  filterKey,
}: Props<Value>) {
  return (
    <MultipleSelector<Value>
      label={loading.is ? loading.label : label}
      filterKey={filterKey}
      disabled={loading.is}
      options={options}
      value={value}
      handleChange={onChange}
    />
  );
}

CommonFilterSelector.displayName = 'CommonFilterSelector';
