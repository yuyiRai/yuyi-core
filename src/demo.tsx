import React from 'react';
import ReactDOM from 'react-dom';
// import './demo/index.css';
// import App from './demo/App';
import * as serviceWorker from './demo/serviceWorker';
import { App } from "./components/Form/Demo";
import { AppContainer } from 'react-hot-loader'
import { PageContainer } from './components/Container/index';


export const demo = () => {
  const container = document.getElementById('root')
  if (container) {
    // ReactDOM.render(<App />, document.getElementById('root'));
    ReactDOM.render(<AppContainer><PageContainer><App /></PageContainer></AppContainer>, container);

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }
}