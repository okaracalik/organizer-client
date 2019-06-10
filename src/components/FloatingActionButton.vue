<template>
  <q-btn
      fab
      round
      color="primary"
      class="fixed"
      style="right: 18px; bottom: 18px"
      @click="$router.push(next)"
      icon="add"
    />
</template>

<script>
export default {
  name: 'FloatingActionButton',
  props: {
    next: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
</style>
