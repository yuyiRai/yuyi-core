import { addParameters, configure, addDecorator } from '@storybook/react';
import 'storybook-addon-material-ui'
import { withInfo } from "@storybook/addon-info";
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';
// import { jsxDecorator } from 'storybook-addon-jsx';
// import { withConsole } from '@storybook/addon-console';

// import '@storybook/addon-console';
// automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /.stories.tsx$/);
addParameters({
  backgrounds: [
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ],
});
// addDecorator(jsxDecorator);
addParameters({
  options: {
    theme: themes.dark,
    viewport: {
      /**
      * name to display in the dropdown
      * @type {String}
      */
      name: 'Responsive',
      /**
       * Inline styles to be applied to the story (iframe).
       * styles is an object whose key is the camelCased version of the style name, and whose
       * value is the style’s value, usually a string
       * @type {Object}
       */
      styles: {
        width: '100%',
        height: '100%',
      },
      /**
       * type of the device (e.g. desktop, mobile, or tablet)
       * @type {String}
       */
      type: 'desktop'
    }
  },
})
// addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withInfo);
addDecorator(withKnobs)
addDecorator(muiTheme())
function loadStories() {
  req.keys().forEach(req);
  // require('../src/stories/demo.tsx');
  // require('../src/stories/index.js');
}

configure(loadStories, module);