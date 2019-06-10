<template>
  <div class="row">
    <q-list class="col-md-3" striped-odd>
      <q-header>
        <q-icon name="fas fa-check"/>
        Succeeded
        <q-chip small color="green-10">{{succeeded.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'succeeded'}"
        />
      </q-header>
      <q-item v-for="(item, index) in succeeded.slice(0, shownItems.succeeded)" :key="index">
        <q-item-label>{{ format(item) }}</q-item-label>
        <q-item-section class="text-right">
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-forward"
            color="deep-orange-6"
            round
            @click.native="skip(...succeeded.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-times"
            color="red-6"
            round
            @click.native="fail(...succeeded.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-trash"
            color="brown-6"
            round
            @click.native="() => succeeded.splice(index, 1)"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="shownItems.succeeded < succeeded.length">
        <q-btn color="light-blue-4" class="full-width" label="Show more..." @click.native="() => shownItems.succeeded += 10"/>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped>
      <q-header>
        <q-icon name="fas fa-forward"/>
        Skipped
        <q-chip small color="deep-orange-10">{{skipped.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'skipped'}"
        />
      </q-header>
      <q-item v-for="(item, index) in skipped.slice(0, shownItems.skipped)" :key="index">
        <q-item-label>{{ format(item) }}</q-item-label>
        <q-item-section class="text-right">
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-check"
            color="green-6"
            round
            @click.native="succeed(...skipped.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-times"
            color="red-6"
            round
            @click.native="fail(...skipped.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-trash"
            color="brown-6"
            round
            @click.native="() => skipped.splice(index, 1)"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="shownItems.skipped < skipped.length">
        <q-btn color="light-blue-4" class="full-width" label="Show more..." @click.native="() => shownItems.skipped += 10"/>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped-odd>
      <q-header>
        <q-icon name="fas fa-times"/>
        Failed
        <q-chip small color="red-10">{{failed.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'failed'}"
        />
      </q-header>
      <q-item v-for="(item, index) in failed.slice(0, shownItems.failed)" :key="index">
        <q-item-label>{{ format(item) }}</q-item-label>
        <q-item-section class="text-right">
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-check"
            color="green-6"
            round
            @click.native="succeed(...failed.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-forward"
            color="deep-orange-6"
            round
            @click.native="skip(...failed.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-trash"
            color="brown-6"
            round
            @click.native="() => failed.splice(index, 1)"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="shownItems.failed < failed.length">
        <q-btn color="light-blue-4" class="full-width" label="Show more..." @click.native="() => shownItems.failed += 10"/>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped>
      <q-header>
        <q-icon name="fas fa-angle-right"/>
        Next
        <q-chip small color="blue-10">{{next.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'next'}"
        />
      </q-header>
      <q-item v-for="(item, index) in next.slice(0, shownItems.next)" :key="index">
        <q-item-label>{{ format(item) }}</q-item-label>
        <q-item-section class="text-right">
          <q-btn
            v-if="isAfter(item)"
            class="q-mr-xs"
            size="xs"
            icon="fas fa-check"
            color="green-6"
            round
            @click.native="succeed(...next.splice(index, 1))"
          />
          <q-btn
            class="q-mr-xs"
            size="xs"
            icon="fas fa-forward"
            color="deep-orange-6"
            round
            @click.native="skip(...next.splice(index, 1))"
          />
          <q-btn
            v-if="isAfter(item)"
            class="q-mr-xs"
            size="xs"
            icon="fas fa-times"
            color="red-6"
            round
            @click.native="fail(...next.splice(index, 1))"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="shownItems.next < next.length">
        <q-btn color="light-blue-4" class="full-width" label="Show more..." @click.native="() => shownItems.next += 10"/>
      </q-item>
    </q-list>
    <q-dialog v-model="dateModal.isOpened">
      <!-- <q-date v-model="dateModal.value" type="date"/> -->
      <q-btn
        color="warning"
        class="float-left"
        label="cancel"
        @click.native="() => {dateModal.value=null; dateModal.isOpened=false}"
      />
      <q-btn
        color="positive"
        class="float-right"
        label="add"
        @click.native="() => {$props[dateModal.selected].push(dateModal.value); dateModal.selected = null; dateModal.value=null; dateModal.isOpened=false}"
      />
    </q-dialog>
  </div>
</template>

<script>
import { format, isAfter } from 'date-fns'

export default {
  name: 'Occurrences',
  props: {
    succeeded: {
      type: Array,
      default: () => []
    },
    skipped: {
      type: Array,
      default: () => []
    },
    next: {
      type: Array,
      default: () => []
    },
    failed: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      shownItems: {
        next: 10,
        failed: 10,
        skipped: 10,
        succeeded: 10
      },
      dateModal: {
        isOpened: false,
        value: null,
        selected: null
      }
    }
  },
  methods: {
    format (d) {
      return format(d, ' DD MMM YY, dd')
    },
    succeed (item) {
      this.succeeded.push(item)
    },
    skip (item) {
      this.skipped.push(item)
    },
    fail (item) {
      this.failed.push(item)
    },
    isAfter (d) {
      return isAfter(new Date(), d)
    }
  }
}
</script>
