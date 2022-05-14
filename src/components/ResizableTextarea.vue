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
    localSubmitHandler(event) {
      this.submitHandler(event);
      const { input } = this.$refs;
      input.rows = 1;
    },
  },
};
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/form-control-has-label -->
  <textarea
    ref="input"
    @keydown.ctrl.enter="localSubmitHandler"
    @keydown.meta.enter="localSubmitHandler"
    @input="resizeWithText"
    :value="modelValue"
    rows="1"
  />
  <!-- eslint-enable -->
</template>
