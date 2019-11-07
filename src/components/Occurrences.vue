<template>
  <!-- list -->
  <q-list separator bordered>
    <!-- header -->
    <q-item-label header class="text-bold text-capitalize">
      <q-icon :name="getTaskIconAlt(type)" />
      {{ type }}
      <q-badge :color="getTaskColorDarker(type)" text-color="white">{{items.length}}</q-badge>
      <q-btn  flat color="primary" icon="mdi-plus-circle" @click="customDate.isOpen = true" />
    </q-item-label>
    <!-- items -->
    <q-item v-for="(item, index) in items.slice(0, shownItems)" :key="index">
      <q-item-section>{{ format(item, ' DD MMM YY, dd') }}</q-item-section>
      <q-btn
        v-if="['next', 'failed', 'skipped'].includes(type) && isDue(item)"
        round
        size="sm"
        :color="getTaskColor('succeeded')"
        :icon="getTaskIconAlt('succeeded')"
        @click.native="$emit('occurrence-succeed', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'failed', 'next'].includes(type) && isDue(item)"
        round
        size="sm"
        :color="getTaskColor('skipped')"
        :icon="getTaskIconAlt('skipped')"
        @click.native="$emit('occurrence-skip', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'next'].includes(type) && isDue(item)"
        round
        size="sm"
        :color="getTaskColor('failed')"
        :icon="getTaskIconAlt('failed')"
        @click.native="$emit('occurrence-fail', items.splice(index, 1)[0])"
      />
      <q-btn
        v-if="['succeeded', 'skipped', 'failed'].includes(type) && isDue(item)"
        round
        size="sm"
        :color="getTaskColor('removed')"
        :icon="getTaskIconAlt('removed')"
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
import { format, isAfter, isToday, isPast, parse } from 'date-fns'
import { getTaskColor, getTaskColorDarker, getTaskIconAlt } from '../services/utils'

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
  methods: {
    format,
    isAfter,
    getTaskColor,
    getTaskColorDarker,
    getTaskIconAlt,
    isDue (date) {
      return isToday(date) || isPast(date)
    },
    addCustomDate () {
      console.log(parse(this.customDate.input))
      this.$emit('add-custom-date', { type: this.type, item: parse(this.customDate.input) })
      this.customDate.input = new Date()
      this.customDate.isOpen = false
    }
  }
}
</script>
