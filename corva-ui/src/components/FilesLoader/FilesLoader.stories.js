// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { FilesLoader as FilesLoaderComponent } from '~/components/FilesLoader';

export const FilesLoader = props => <FilesLoaderComponent {...props} />;

FilesLoader.storyName = 'FilesLoader';

export default {
  title: 'Components/FilesLoader',
  component: FilesLoaderComponent,
  argTypes: {
    name: {
      table: {
        type: { summary: 'string' },
        defaultValue: {
          summary:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiuso consectetur adipiscing elit, sed do eiusoo.edm.xml',
        },
      },
    },
    sizeBytes: {
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 100 },
      },
    },
    error: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    loadedBytes: {
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 100 },
      },
    },
    onReload: {
      defaultValue: () => {},
    },
    onDelete: {
      defaultValue: () => {},
    },
  },
  args: {
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiuso consectetur adipiscing elit, sed do eiusoo.edm.xml',
    sizeBytes: 100,
    loadedBytes: 100,
    error: false,
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/FilesLoader/FilesLoader.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9520%3A19052',
  },
};
