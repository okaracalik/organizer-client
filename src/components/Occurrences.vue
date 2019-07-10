<template>
  <!-- list -->
  <q-list separator bordered>
    <!-- header -->
    <q-item-label header class="text-bold text-capitalize">
      <q-icon :name="properties.icon"/>
      {{ properties.title }}
      <q-chip :color="properties.color" text-color="white">{{items.length}}</q-chip>
    </q-item-label>
    <!-- items -->
    <q-item v-for="(item, index) in items.slice(0, shownItems)" :key="index">
      <q-item-section>{{ format(item, ' DD MMM YY, dd') }}</q-item-section>
      <q-btn
        v-if="['next', 'failed', 'skipped'].includes(properties.title) && isAfter(new Date(), item)"
        round
        size="sm"
        color="green-6"
        icon="mdi-check-bold"
        @click.native="$emit('occurrence-succeed', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'failed', 'next'].includes(properties.title) && isAfter(new Date(), item)"
        round
        size="sm"
        color="deep-orange-6"
        icon="mdi-skip-forward"
        @click.native="$emit('occurrence-skip', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'next'].includes(properties.title) && isAfter(new Date(), item)"
        round
        size="sm"
        color="red-6"
        icon="mdi-close-circle"
        @click.native="$emit('occurrence-fail', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'failed'].includes(properties.title) && isAfter(new Date(), item)"
        round
        size="sm"
        color="brown-6"
        icon="mdi-trash-can"
        @click.native="items.splice(index, 1)"
      />
    </q-item>
    <q-item v-if="shownItems < items.length">
      <q-btn
        color="light-blue-4"
        class="full-width"
        label="Show more..."
        @click.native="() => shownItems += 10"
      />
    </q-item>
  </q-list>
</template>

<script>
import { format, isAfter } from 'date-fns'

// TODO: custom date
export default {
  name: 'Occurrences',
  props: {
    type: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      shownItems: 10
    }
  },
  computed: {
    properties () {
      if (this.type === 'succeeded') {
        return {
          title: this.type,
          icon: 'mdi-check-bold',
          color: 'green-10'
        }
      }
      else if (this.type === 'failed') {
        return {
          title: this.type,
          icon: 'mdi-close-circle',
          color: 'red-10'
        }
      }
      else if (this.type === 'skipped') {
        return {
          title: this.type,
          icon: 'mdi-skip-forward',
          color: 'deep-orange-10'
        }
      }
      else if (this.type === 'next') {
        return {
          title: this.type,
          icon: 'mdi-arrow-right-circle-outline',
          color: 'blue-10'
        }
      }
      else {
        return null
      }
    }
  },
  methods: {
    format,
    isAfter
  }
}
</script>
