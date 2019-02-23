<template>
  <q-page padding>
    <!-- content -->
    <!-- fab -->
    <q-btn
      fab
      round
      color="primary"
      class="fixed"
      style="right: 18px; bottom: 18px"
      @click="$router.push('/tasks/new')"
      icon="fas fa-plus"
    />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>

<style>
</style>
