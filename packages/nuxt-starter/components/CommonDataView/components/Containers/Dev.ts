import Vue from 'vue'
export const Dev = Vue.extend({
  functional: true,
  render(h, { data, children }) {
    return process && process.env && process.env.NODE_ENV === 'development' ? h('div', data, children) : null;
  }
})
