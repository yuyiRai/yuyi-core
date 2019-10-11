<template>
  <div>
    <a-checkbox-group
      :multiple="multiple"
      :value="selectedTags"
      @change="onChange"
      :options="options"
    />
    <!-- <a-checkable-tag
      v-for="option in options"
      :key="option.value"
      :checked="selectedTags.includes(option.value)"
      @change="(checked) => handleChange(option.value, checked)"
    >{{ option.label }}</a-checkable-tag>-->
  </div>
</template>
<script>
import { map } from 'lodash'

export default {
  model: {
    value: 'value',
    event: 'change'
  },
  props: {
    tags: {
      default: () => ['Movies', 'Books', 'Music', 'Sports']
    },
    formatter: {
      type: Function,
      default: v => v
    },
    multiple: {
      type: Boolean
    }
  },
  watch: {
    value: {
      handler(value) {
        this.selectedTags = value || []
      },
      immediate: true
    }
  },
  computed: {
    options() {
      return map(this.tags, (label, value) => ({ label, value: value + '' }))
    }
  },
  data() {
    return {
      selectedTags: []
    }
  },
  methods: {
    onChange(value) {
      this.selectedTags = value
      this.$emit('change', this.formatter(this.multiple ? Array.from(new Set(this.selectedTags)) : this.selectedTags))
    },
    handleChange(value, checked) {
      const { selectedTags } = this
      const nextSelectedTags = checked ? [...selectedTags, value] : selectedTags.filter(t => t !== value)
      console.log('You are interested in: ', nextSelectedTags)
      this.selectedTags = this.multiple ? nextSelectedTags : checked ? [value] : []
      this.$emit(
        'change',
        this.formatter(this.multiple ? Array.from(new Set(this.selectedTags)) : this.selectedTags[0])
      )
    }
  }
}
</script>
