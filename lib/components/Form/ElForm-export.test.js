import { ElCommonForm2 } from "./ElForm-export";
import "../../global";
import render from '@vue/test-utils';
import Vue from 'vue';
var App = Vue.component('App', {
    components: { ElCommonForm2: ElCommonForm2 },
    render: function (h) {
        return h(ElCommonForm2, {}, [h('span', {
                slot: 'inter'
            })]);
    }
});
describe('Component', function () {
    test('is a Vue instance', function () {
        // new Vue({
        //   render: h => h(App)
        // }).$mount(document.createElement('div'))
        var wrapper = render.mount(App);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
//# sourceMappingURL=ElForm-export.test.js.map