import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  spacing: 2
})
ReactDOM.render((
  <StyledThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StyledThemeProvider>
), document.getElementById('root'));

import('./wasm').catch(console.error)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
