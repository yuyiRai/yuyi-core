// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
import { Utils } from '../utils'
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
describe('count', () => {
  it('1+2=3', async() => {
    expect.assertions(1)
    expect(1+2).toBe(await Utils.waitingPromise(0, 3))
    return
  });
})