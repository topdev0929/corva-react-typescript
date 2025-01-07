import { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { GradientManager } from './GradientManager';
import Button from '../Button';
import { Box, LinearProgress } from '@material-ui/core';
import { GradientPicker } from '../GradientPicker';

const useSampleGradientStorage = () => {
  const [gradients, setGradientsInternal] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const setGradients = async gradients => {
    setGradientsInternal(gradients);
    setIsBusy(true);
    try {
      await new Promise(resolve => setTimeout(() => resolve('saved'), 2000));
    } finally {
      setIsBusy(false);
    }
  }

  return { gradients, setGradients, isBusy };
}

export const Default = props => {
  const [gradientId, setGradientId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(null);
  const { gradients, setGradients, isBusy } = useSampleGradientStorage();

  const handleChange = ({ gradientId }) => {
    setGradientId(gradientId);
    action('onChange')(gradientId);
  }

  const handleGradientsChange = gradients => {
    setGradients(gradients);
    action('onGradientsChange')(gradients);
  };

  const handleEditModeChange = editState => {
    setIsEditorOpen(editState);
    action('onGradientEditStateChange')(editState);
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <GradientManager
        {...props}
        gradientId={gradientId}
        gradients={gradients}
        onChange={handleChange}
        onGradientsChange={handleGradientsChange}
        disableGradientsManagement={isBusy}
        onGradientEditStateChange={handleEditModeChange}
      />
      <Box paddingTop={8}>
        <Button color="secondary" variant="contained" disabled={isEditorOpen}>SAMPLE Submit</Button>
        <Box paddingTop={1} color={isEditorOpen ? 'pink' : 'gray'}>Disable "Submit" while editing gradient</Box>
        <Box paddingTop={1} color={isBusy ? 'pink' : 'gray'}>Disable gradient controls while busy with requests</Box>
        {isBusy && <LinearProgress></LinearProgress>}
      </Box>
    </div>
  );
};

export default {
  title: 'Components/GradientManager',
  component: GradientManager,
  subcomponents: { GradientPicker },
  argTypes: {

  },
  parameters: {
    docs: {
      description: {
        component: `<div>
          The Gradient Manager component takes care of the UI part of the shared user gradient feature and solves multiple problems as once.
          <ul>
            <li>It is <strong>a gradient select</strong>, that can be used in your app settings and allow a user to pick a gradient from the list.
            The <code>onChange</code> callback is invoked each time a user picks a gradient.</li>
            <li>This component also allows a user to Manage gradients, e.g. to add, remove, and edit custom ones. The <code>onGradientsChange</code> callback is invoked on any of such user actions.</li>
          </ul>
          <h4>Gradients Data</h4>
          The component itself does not store any data so you still need to implement two other essential parts in your app:
          <ul>
            <li>The storage. It should take care of fetching and storing gradients to User Settings.
              It should be quite small. See "useGradientStorage" implementation in the Formation Evaluation app for reference.
              It is a good idea to put this code close to the top of your application so you can share the data
              with any component of your app using props or context.</li>
            <li>If your app stores <em>gradient stops<em> along with <em>gradientId<em> somewhere in your app (for example in Template configuration)
              then you have to update the stops every time user changes the gradient with linked id.</li>
          </ul>

          <h4>Built-in gradients</h4>
          A set of predefined gradients is included in this component. You can also replace it with your own list.
          Only user created gradients are present in the argument of <code>onGradientsChange</code> callback.
          You can import <code>DEFAULT_GRADIENTS</code> from <em>@corva/ui/constants/componentsSettings</em>.
        </div>`,
      },
    },
    sourceLink: 'https://github.com/corva-ai/corva-ui/blob/feat/develop/src/components/GradientManager/GradientManager.tsx',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System',
  },
};
