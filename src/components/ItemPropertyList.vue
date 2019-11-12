<template>
  <div class="row" v-if="items.length > 0">
    <q-list class="col-md-6 col-xs-12" separator bordered>
      <q-item-label header>Unchecked</q-item-label>
      <q-item v-for="(item, index) in unchecked" :key="index">
        <q-item-section side>
          <q-item-label>
            <q-btn
              class="unchecked-handle"
              flat
              icon="fas fa-grip-vertical"
              :style="{ cursor: 'grab', width: '12px' }"
            />
            <q-toggle
              v-model="item.list_items.checked"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ item.description }}
            <tag-property-list :tags="item.tags" />
          </q-item-label>
        </q-item-section>
        <q-item-section></q-item-section>
        <q-item-section side>
          <q-toggle v-model="item.enabled" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list class="col-md-6 col-xs-12" separator bordered>
      <q-item-label header>Checked</q-item-label>
      <q-item v-for="(item, index) in checked" :key="index">
        <q-item-section side>
          <q-item-label>
            <q-btn
              class="unchecked-handle"
              flat
              icon="fas fa-grip-vertical"
              :style="{ cursor: 'grab', width: '12px' }"
            />
            <q-toggle
              v-model="item.list_items.checked"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
            />
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ item.description }}
            <tag-property-list :tags="item.tags" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="item.enabled" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import TagPropertyList from './TagPropertyList'

// TODO: dragging
export default {
  name: 'ItemPropertyList',
  components: {
    TagPropertyList
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    unchecked () {
      return this.items.filter(i => !i.list_items.checked)
    },
    checked () {
      return this.items.filter(i => i.list_items.checked)
    }
  }
}
</script>
