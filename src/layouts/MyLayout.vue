<template>
  <q-layout view="lHh Lpr lFf">

    <q-header>
      <q-toolbar class="bg-orange-9 text-white">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>{{ $route.meta.title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-expansion-item
          icon="fas fa-tasks"
          label="Tasks"
          default-opened
          :content-inset-level="0.3"
        >
          <q-item clickable tag="a" to="/calendar">
            <q-item-section avatar>
              <q-icon name="mdi-calendar-month" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Calendar</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/tasks">
            <q-item-section avatar>
              <q-icon name="fas fa-list" />
            </q-item-section>
            <q-item-section>
              <q-item-label>List</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/occurrences">
            <q-item-section avatar>
              <q-icon name="update" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Occurrences</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item
          icon="mdi-format-list-checkbox"
          label="Lists"
          default-opened
          :content-inset-level="0.3"
        >
          <q-item clickable tag="a" to="/lists">
            <q-item-section avatar>
              <q-icon name="mdi-format-list-bulleted-square" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Overview</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/items">
            <q-item-section avatar>
              <q-icon name="mdi-square-inc" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Items</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item clickable tag="a" to="/tags">
          <q-item-section avatar>
            <q-icon name="fas fa-tag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tags</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',
  meta () {
    return {
      title: this.$route.meta.title
    }
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  }
}
</script>
