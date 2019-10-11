<template>
  <div class="logo">
    <router-link :to="{name:'LargeData'}">
      <img v-if="!light" src="../../assets/logo.png" alt="logo" />
      <img v-else src="../../assets/logo_light.png" alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    light: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '洗钱风险管理系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
