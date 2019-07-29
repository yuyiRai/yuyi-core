/// <reference types="react-scripts" />
import { Theme } from '@material-ui/core';
import { ThemeProps as ThemePropsBase } from 'styled-components';

declare global {
  interface ThemeProps<T> extends ThemePropsBase<any> {
    theme: Theme;
  }
}
