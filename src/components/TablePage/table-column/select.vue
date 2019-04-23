<template>
    <span>{{ show || value }}</span>
</template>

<script>
/* eslint-disable */
export default {
    props: ['value', 'options', 'split'],
    computed:{
        splitValue(){
            return (this.value || '').split(',')
        },
        show(){
            try{
                return this.options.filter(item=>this.isIn(item.value)).map(i=>i.label).join(this.split || '/')
            } catch(e) {
                return this.value
            }
        }
    },
    data(){
        return {

        }
    },
    created(){
        // console.log(this.value, this.options.map(i=>i.value))
    },
    methods: {
        isIn(value) {
            return this.splitValue.indexOf(value)>-1
        }
    }
}
</script>

<style>

</style>
