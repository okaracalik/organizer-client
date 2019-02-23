<template>
  <div class="row">
    <q-list class="col-md-3" striped-odd>
      <q-list-header>Succeeded
        <q-chip small color="green-10">{{succeeded.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'succeeded'}"
        />
      </q-list-header>
      <q-item v-for="(item, index) in succeeded" :key="index">
        <q-item-main>{{ format(item) }}</q-item-main>
        <q-item-side class="text-right">
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
        </q-item-side>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped>
      <q-list-header>Skipped
        <q-chip small color="deep-orange-10">{{skipped.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'skipped'}"
        />
      </q-list-header>
      <q-item v-for="(item, index) in skipped" :key="index">
        <q-item-main>{{ format(item) }}</q-item-main>
        <q-item-side class="text-right">
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
        </q-item-side>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped-odd>
      <q-list-header>Failed
        <q-chip small color="red-10">{{failed.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'failed'}"
        />
      </q-list-header>
      <q-item v-for="(item, index) in failed" :key="index">
        <q-item-main>{{ format(item) }}</q-item-main>
        <q-item-side class="text-right">
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
        </q-item-side>
      </q-item>
    </q-list>
    <q-list class="col-md-3" striped>
      <q-list-header>Next
        <q-chip small color="blue-10">{{next.length}}</q-chip>
        <q-btn
          class="float-right"
          size="sm"
          icon="fas fa-plus"
          round
          color="teal"
          @click.native="() => {dateModal.isOpened = true; dateModal.selected = 'next'}"
        />
      </q-list-header>
      <q-item v-for="(item, index) in next" :key="index">
        <q-item-main>{{ format(item) }}</q-item-main>
        <q-item-side class="text-right">
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
        </q-item-side>
      </q-item>
    </q-list>
    <q-modal v-model="dateModal.isOpened">
      <q-datetime-picker v-model="dateModal.value" type="date"/>
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
    </q-modal>
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
