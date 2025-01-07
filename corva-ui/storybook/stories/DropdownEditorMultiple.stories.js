import { useState } from 'react';
import PropTypes from 'prop-types';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { StyledDropdownEditor } from '~/components/SettingEditors';

const METRIC_TYPES = [
  { label: 'drilled feet', value: 1 },
  { label: 'drilled feet rotary', value: 2 },
  { label: 'drilled feet slide', value: 3 },
];

export const DropdownEditorMultiple = props => {
  const [value, setValue] = useState(props.defaultValue || []);

  return (
    <div>
      <StyledDropdownEditor
        currentValue={value}
        defaultValue={props.defaultValue}
        onChange={selections => setValue(selections.includes(null) ? [] : selections)}
        options={METRIC_TYPES}
        placeholder={props.placeholder}
        multiple
        disabled={props.disabled}
        classes={props.classes}
        renderValue={selected =>
          selected.length === 0 ? (
            <span>{props.placeholder}</span>
          ) : (
            METRIC_TYPES.filter(type => selected.includes(type.value))
              .map(item => item.label)
              .join(', ')
          )
        }
        errorText={props.errorText}
      />
    </div>
  );
};

DropdownEditorMultiple.propTypes = {
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  errorText: PropTypes.string,
};

DropdownEditorMultiple.defaultProps = {
  defaultValue: [2],
  placeholder: 'Choose An Option',
  disabled: false,
  errorText: '',
};

export default {
  title: 'Components/Dropdown Editor',
  component: DropdownEditorMultiple,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/SettingEditors/DropdownEditor/index.js',
  },
};
