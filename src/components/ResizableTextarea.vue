<script>
export default {
  name: 'ResizableTextarea',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    resizeWithText() {
      const { input } = this.$refs;
      input.rows = input.value.split('\n').length;
      this.$emit('update:modelValue', input.value);
    },
  },
};
</script>

<template>
  <textarea
    ref="input"
    @input="resizeWithText"
    :value="modelValue"
    rows="1"
  />
</template>
