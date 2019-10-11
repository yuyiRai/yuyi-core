<template>
  <aml-check-button-group
    :value="value"
    @change="$emit('change', $event)"
    :options="options"
    defaultValue="2"
    buttonStyle="solid"
  ></aml-check-button-group>
</template>
<script>
export default {
  model: {
    value: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      options: Object.freeze([
        { value: '2', label: '含个贷' },
        { value: '0', label: '不含个贷' },
        { value: '1', label: '仅个贷' }
      ])
    }
  }
}
</script>
