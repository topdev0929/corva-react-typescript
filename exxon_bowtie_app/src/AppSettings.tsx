type AppSettingsProps = {
  app: { [key: string]: any };
  appData: { [key: string]: any };
  company: { [key: string]: any };
  onSettingChange: (key: string, value: any) => void;
  settings: {
    isExampleCheckboxChecked: boolean;
  };
  user: { [key: string]: any };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppSettings = (props: AppSettingsProps): JSX.Element => {
  return <></>;
};

// Important: Do not change root component default export (AppSettings.js). Use it as container
//  for your App Settings. It's required to make build and zip scripts work as expected;
export default AppSettings;
