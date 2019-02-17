<template>
  <div class="row">
    <q-list class="col-md-3" striped-odd>
      <q-list-header>Succeeded
        <q-chip small color="green-10">{{succeeded.length}}</q-chip>
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
