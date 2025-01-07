/* eslint-disable react/prop-types */
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import TextLink from '~/components/TextLink';

export const Default = props => (
  <>
    <p>A simple text link. Has almost the same API as an `a` tag.</p>
    <p>
      By default opens a link in a new tab, so you need to explicitly set{' '}
      <code>target=&quot;_self&quot;</code> to open your link in the current tab. For more advanced
      use-cases, refer to the component source code to figure out the best way to make it work as
      what you want
    </p>
    <p>Example of usage:</p>
    <div style={{ fontSize: 14, color: '#BDBDBD' }}>
      See our sample{' '}
      <TextLink
        href="https://github.com/corva-ai/corva-example-ui-apps.git"
        tooltipText="https://github.com/corva-ai/corva-example-ui-apps.git"
        {...props}
      >
        Frontend Apps
      </TextLink>
    </div>
  </>
);

Default.storyName = 'TextLink';

export default {
  title: 'Components/TextLink',
  component: TextLink,
  argTypes: {
    linkProps: {
      name: '...linkProps',
      description: 'Other props are passed to the link element. See implementation for details',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/TextLink/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9694%3A126',
  },
};
