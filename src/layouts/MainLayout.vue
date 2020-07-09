<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-green-14">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>Organizer</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">Menu</q-item-label>
        <q-item clickable tag="a" to="/calendar">
          <q-item-section avatar>
            <q-icon name="las la-calendar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/tasks">
          <q-item-section avatar>
            <q-icon name="las la-list-ul" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tasks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/occurrences">
          <q-item-section avatar>
            <q-icon name="las la-history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Occurrences</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/tags">
          <q-item-section avatar>
            <q-icon name="las la-tags" />
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
  name: 'MainLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
