<script>
export default {
  name: 'ResizableTextarea',
  methods: {
    resize() {
      const { input } = this.$refs;
      const lineBreaks = input.value.split('\n').length;
      input.rows = lineBreaks;
    },
  },
};
</script>

<template>
  <textarea
    ref="input"
    @input="resize"
    :value="value"
    rows="1"
  />
</template>
