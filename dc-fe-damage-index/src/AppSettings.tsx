const AppSettings = (): JSX.Element => {
  return <div />;
};
AppSettings.defaultProps = {
  user: {},
  company: {},
};

// Important: Do not change root component default export (AppSettings.js). Use it as container
//  for your App Settings. It's required to make build and zip scripts work as expected;
export default AppSettings;
