import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Thing } from '..';
import { oc } from 'ts-optchain';

describe('it', () => {
  it('renders without crashing', () => {
    
    const div = document.createElement('div');
    ReactDOM.render(<Thing />, div);
    ReactDOM.unmountComponentAtNode(div);
    expect(oc({
      a: 'hello',
      b: { d: 'world' },
      c: [-100, 200, -300],
    }).b.d('null!')).toBe('world')
  });
});
