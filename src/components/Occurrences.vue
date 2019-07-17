<template>
  <!-- list -->
  <q-list separator bordered>
    <!-- header -->
    <q-item-label header class="text-bold text-capitalize">
      <q-icon :name="properties.icon" />
      {{ properties.title }}
      <q-badge :color="properties.color" text-color="white">{{items.length}}</q-badge>
      <q-btn  flat color="primary" icon="mdi-plus-circle" @click="customDate.isOpen = true" />
    </q-item-label>
    <!-- items -->
    <q-item v-for="(item, index) in items.slice(0, shownItems)" :key="index">
      <q-item-section>{{ format(item, ' DD MMM YY, dd') }}</q-item-section>
      <q-btn
        v-if="['next', 'failed', 'skipped'].includes(properties.title) && isDue(item)"
        round
        size="sm"
        color="green-6"
        icon="mdi-check-bold"
        @click.native="$emit('occurrence-succeed', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'failed', 'next'].includes(properties.title) && isDue(item)"
        round
        size="sm"
        color="deep-orange-6"
        icon="mdi-skip-forward"
        @click.native="$emit('occurrence-skip', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'next'].includes(properties.title) && isDue(item)"
        round
        size="sm"
        color="red-6"
        icon="mdi-close-circle"
        @click.native="$emit('occurrence-fail', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'failed'].includes(properties.title) && isDue(item)"
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
    <q-dialog content-class="text-center" v-model="customDate.isOpen">
      <q-card style="width: 330px">
        <q-card-section>
          <div class="text-h6">Add Custom Date</div>
        </q-card-section>

        <q-card-section>
          <q-date
            v-model="customDate.input"
            mask="YYYY-MM-DD HH:mm"
            :first-day-of-week="1"
            @input="addCustomDate"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-list>
</template>

<script>
import { format, isAfter, isToday, isPast } from 'date-fns'

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
      shownItems: 10,
      customDate: {
        input: new Date(),
        isOpen: false
      }
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
    isAfter,
    isDue (date) {
      return isToday(date) || isPast(date)
    },
    addCustomDate () {
      this.$emit('add-custom-date', { type: this.type, item: this.customDate.input })
      this.customDate.input = new Date()
      this.customDate.isOpen = false
    }
  }
}
</script>
