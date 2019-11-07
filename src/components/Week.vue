<template>
  <div class="row">
    <slot name="day" :props="{ starts, ends }"></slot>
  </div>
</template>

<script>
export default {
  name: 'Week',
  props: {
    starts: {
      type: Date,
      required: true
    },
    ends: {
      type: Date,
      required: true
    }
  }
}
</script>
