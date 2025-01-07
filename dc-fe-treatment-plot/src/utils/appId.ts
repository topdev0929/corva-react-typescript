const QA_APP_ID = 23120;

// for localhost appId is 1, so we need to mock QA appId value
export default appId => (appId === 1 ? QA_APP_ID : appId);
