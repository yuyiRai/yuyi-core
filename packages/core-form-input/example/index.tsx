import 'react-app-polyfill/ie11';
import 'regenerator-runtime'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../dist';


const App = () => {
  return (
    <div>
      <Thing />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
