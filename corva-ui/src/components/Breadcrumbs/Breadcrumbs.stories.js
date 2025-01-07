import BreadcrumbsComponent from '~/components/Breadcrumbs';

export const Breadcrumbs = () => {
  return (
    <BreadcrumbsComponent
      pathItems={[
        { text: 'Test', href: '/config/test' },
        { text: 'Test2', href: '/config/test/2' },
      ]}
    />
  );
};

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    pathItems: {
      name: 'pathItems',
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Breadcrumbs/index.js',
  },
};
