import { useState, useEffect } from 'react';
import { getS3DownloadLink } from '~/clients/jsonApi';

function useSignedURL(fileName) {
  const [signedURL, setSignedURL] = useState('');

  useEffect(() => {
    if (fileName)
      getS3DownloadLink(fileName)
        .then(response => setSignedURL(response.url))
        .catch(() => setSignedURL(''));
  }, [fileName]);

  return signedURL;
}

export default useSignedURL;
