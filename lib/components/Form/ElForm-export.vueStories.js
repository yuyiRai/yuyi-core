import { ElCommonForm2 } from "./ElForm-export";
import '../../global';
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Vue from 'vue';
var App = Vue.component('App', {
    render: function (h) {
        return h('div', {}, [
            '123',
            h(ElCommonForm2, {}, [h('span', {
                    slot: 'inter'
                })])
        ]);
    }
});
// 示例组件
storiesOf('Welcome', module).add('show App', function () { return ({
    components: { App: App },
    render: function (h) {
        return h(App, {
            props: {
                storeRef: this.action
            }
        });
    },
    methods: { action: function (store) {
            console.log(store);
            action('get Store');
            linkTo('Button');
        } }
}); });
//# sourceMappingURL=ElForm-export.vueStories.js.map