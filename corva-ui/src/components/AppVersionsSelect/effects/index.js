import { useEffect, useState } from 'react';
import Jsona from 'jsona';
import { getAppPackages } from '~/clients/jsonApi';

const dataFormatter = new Jsona();

const usePackages = (appId, queryParams) => {
  const [state, setState] = useState({
    isLoading: true,
    packages: [],
    error: null,
  });

  useEffect(() => {
    (async function fetchPackages() {
      try {
        const response = await getAppPackages(appId, queryParams);
        setState({
          isLoading: false,
          packages: dataFormatter.deserialize(response),
          error: null,
        });
      } catch (e) {
        setState({
          isLoading: false,
          packages: [],
          error: e,
        });
      }
    })();
  }, [appId]);

  return state;
};

export default usePackages;
