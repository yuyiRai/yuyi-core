/* eslint-disable */
import ItemGroup from './form-component.vue';
import elForm from './CommonForm.js';

/**
 * simple
 */
export const simpleMixin = {
  components: { ItemGroup, elForm },
  props: ['form', 'rules', 'disabled'],
  computed: {
    selectList() {
      return this.$store.state.taskDispatcher
    }
  },
  methods: {
    validate() {
      // console.log('start')
      const dataForm = this.$refs.dataForm;
      if (dataForm == null) {
        return new Promise(r => {
          // console.log('no', true)
          r(true)
        })
      }
      const formList = Utils.isArrayFilter(dataForm, [dataForm])
      // console.log(formList)
      const res = Promise.all(
        Utils.arrayMapDive(formList, (form, index) => {
          return new Promise((resolve) => {
            // console.log('valid', index, form)
            form.validate(valid => {
              // console.log('valid', index, valid)
              resolve(valid)
            })
          })
        })
      )
      return res.then(res => {
        // console.log(!res.some(i=>!i))
        // console.log('end', res)
        return !res.some(i => !i)
      })
    }
  }
}
export default simpleMixin;