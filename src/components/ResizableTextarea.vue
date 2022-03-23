<script>
export default {
  name: 'ResizableTextarea',
  props: ['modelValue', 'submitHandler'],
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
    @keydown.ctrl.enter="submitHandler"
    @keydown.meta.enter="submitHandler"
    @input="resizeWithText"
    :value="modelValue"
    rows="1"
  />
</template>
