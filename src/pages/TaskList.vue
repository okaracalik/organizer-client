<template>
  <q-page padding>
    <!-- content -->
    <!-- fab -->
    <floating-action-button next='/tasks/new' />
  </q-page>
</template>

<script>
import FloatingActionButton from '../components/FloatingActionButton'

export default {
  name: 'TaskList',
  components: {
    FloatingActionButton
  }
}
</script>
