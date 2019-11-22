<template>
  <q-list class="col-md-6 col-xs-12" separator bordered>
    <q-item-label header>{{ title }}</q-item-label>
    <draggable handle=".unchecked-handle" @start="drag=true" @end="log" v-model="d">
      <q-item v-for="(item, index) in d" :key="index">
        <q-item-section side>
          <q-item-label>
            <q-btn
              class="unchecked-handle"
              flat
              icon="fas fa-grip-vertical"
              :style="{ cursor: 'grab', width: '12px' }"
            />
            <q-btn
              flat
              :icon="item.list_items.checked ? 'fas fa-check-square' : 'far fa-square'"
              @click="$emit('check-item', item)"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section @click="$emit('pick-item', item)">
          <q-item-label>
            {{ item.description }}
            {{ item.list_items.order }}
            <tag-property-list :tags="item.tags" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            :color="item.list_items.enabled ? 'green' : 'grey'"
            :icon="item.list_items.enabled ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"
            @click="$emit('enable-item', item)"
          />
        </q-item-section>
      </q-item>
    </draggable>
  </q-list>
</template>

<script>
import draggable from 'vuedraggable'
import TagPropertyList from './TagPropertyList'

// TODO: enable/disable
export default {
  name: 'ItemPropertyList',
  components: {
    draggable,
    TagPropertyList
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      d: this.items
    }
  },
  methods: {
    log (evt) {
      console.log(this.d.map(i => ({ d: i.description, i: i.list_items.order, l: i.list_items.checked })))
      this.$emit('move-item', this.d.map((item, index) => {
        return { ...item, list_items: { ...item.list_items, order: index } }
      }))
      return true
    }
  },
  watch: {
    items (newValue) {
      this.d = newValue
    }
  }
}
</script>
