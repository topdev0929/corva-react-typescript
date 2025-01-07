// In case you update the component src path,
// please also update the GitHub source link at the bottom
import LoadingIndicatorComponent from '~/components/LoadingIndicator';

export const LoadingIndicator = props => <LoadingIndicatorComponent {...props} />;

LoadingIndicator.storyName = 'LoadingIndicator';

export default {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicatorComponent,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/LoadingIndicator/LoadingIndicator.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=13182%3A1005',
  },
};
