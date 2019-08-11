<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="taskList.success" bordered separator>
      <q-item-label header>Tasks</q-item-label>
      <q-item v-for="(item, index) in sortedTasks" :key="index">
        <q-item-section class="cursor-pointer" @click="$router.push(`/tasks/${item.id}`)">
          <q-item-label>
            <q-badge :style="getStyleColors(item.colors)">
              <q-icon name="mdi-checkbox-blank-circle" />
            </q-badge>
            {{ item.title }}
          </q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ format(min(...item.next), 'DD.MM.YYYY') }}</q-item-label>
          <q-item-label
            caption
          >{{ distanceInWordsToNow(min(...item.next)) }} {{ getDueSituation(min(...item.next)) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <tag-property-list :tagIds="item.tags"/>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              color="blue-10"
              text-color="white"
              icon="mdi-checkbox-blank-outline"
              :label="item.next.length"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              color="green-10"
              text-color="white"
              icon="mdi-checkbox-marked-outline"
              :label="item.succeeded.length"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              color="red-10"
              text-color="white"
              icon="mdi-close-circle-outline"
              :label="item.failed.length"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              color="deep-orange-10"
              text-color="white"
              icon="mdi-chevron-double-right"
              :label="item.skipped.length"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div>
            <q-btn
              icon="mdi-subdirectory-arrow-left"
              @click="$router.push(`/tasks/new?parent_id=${item.id}&path=${item.path}`)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- fab -->
    <floating-action-button next="/tasks/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { union } from 'lodash'
import { distanceInWordsToNow, format, isAfter, min, isPast, compareAsc, parse } from 'date-fns'
import { getStyleColors } from '../services/utils'

const { mapState, mapActions } = createNamespacedHelpers('task')

import FloatingActionButton from '../components/FloatingActionButton'
import TagPropertyList from '../components/TagPropertyList'

export default {
  name: 'TaskList',
  components: {
    FloatingActionButton,
    TagPropertyList
  },
  computed: {
    ...mapState({
      taskList: state => state.list
    }),
    sortedTasks () {
      const temp = this.taskList.success.data.map(t => ({
        ...t,
        next: union(...t.occurrences.map(o => o.next)).map(parse),
        succeeded: union(...t.occurrences.map(o => o.succeeded)).map(parse),
        skipped: union(...t.occurrences.map(o => o.skipped)).map(parse),
        failed: union(...t.occurrences.map(o => o.failed)).map(parse)
      }))
      return temp.sort((a, b) => compareAsc(min(...a.next), min(...b.next))
      )
    }
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
    getDueSituation (d) {
      return isAfter(d, new Date()) ? 'left.' : 'passed.'
    },
    getStyleColors,
    distanceInWordsToNow,
    min,
    isPast,
    format
  },
  created () {
    this.findTasks()
  }
}
</script>
