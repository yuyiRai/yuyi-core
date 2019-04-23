/* eslint-disable */
import elForm from './CommonForm.js'
export default {
    components: { elForm },
    computed:{
        param() {
          return this.$route.query
        }
    },
    methods: {  
        initSelect(...taskTypes){
            // console.log(this, this.validate)
            return Promise.all(_.map(taskTypes, taskType=>{
                this.$store.dispatch('GetCodeSelect', { 'codeType': taskType })
            })).catch(() => {
                this.$notify({ title: '失败', message: '选择加载失败', type: 'error' })
            })
        }
    }
}