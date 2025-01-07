import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: Infinity,
    },
  },
});

const withWrappers = Component => {
  return function WrappedComponent(props) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  };
};

export default withWrappers;
