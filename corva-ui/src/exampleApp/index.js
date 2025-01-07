import ReactDOM from 'react-dom';
import { initHighcharts } from '~/config';
import withMUIProvidersHOC from '~/hocs/withMUIProvidersHOC';
import ExampleApp from './ExampleApp';

initHighcharts();
const App = withMUIProvidersHOC(ExampleApp);

ReactDOM.render(<App />, document.getElementById('root'));
