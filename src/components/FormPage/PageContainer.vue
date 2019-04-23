<template>
    <el-row type='flex' justify='center' >
        <el-col :xl='22-parseInt((padding-1)/2)' :lg='23-parseInt(padding-1)' :md='24-parseInt((padding-1)*2)' :sm='24-parseInt((padding-1)*4)' style='margin-left:-2vw; '>
            <slot></slot>
        </el-col>
    </el-row>
</template>

<script>
export default {
  props: {
    padding: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style>

</style>
