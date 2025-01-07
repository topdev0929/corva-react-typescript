import { useEffect, useState } from 'react';
import OffsetWellButtonComponent from '~/components/OffsetWellButton';

export const OffsetWellButton = ({ wells, disabled, expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const onExpandCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  return (
    <>
      <OffsetWellButtonComponent wells={[]} disabled={disabled} />
      <OffsetWellButtonComponent
        wells={wells}
        disabled={disabled}
        expanded={isExpanded}
        onExpand={onExpandCollapse}
      />
    </>
  );
};

OffsetWellButton.storyName = 'OffsetWellButton';

export default {
  title: 'Components/OffsetWellButton',
  component: OffsetWellButton,
  parameters: {
    options: {
      showPanel: true,
    },
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/OffsetWellButton/OffsetWellButton.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9573%3A36025',
  },
  argTypes: {
    onClick: {
      description: 'Callback function called every time when offsetWellButton is clicked',
    },
    wells: {
      description: 'Selected offset wells',
      control: 'object',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    expanded: {
      control: 'boolean',
      description: 'Value of the expanded/collapsed state',
    },
    onExpandCollapse: {
      description: 'Callback function called every time when expand/collapse clicked',
    },
  },
  args: {
    wells: [
      {
        id: 1,
        title: 'test',
      },
    ],
    disabled: false,
    expanded: false,
  },
};
