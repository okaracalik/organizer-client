<template>
  <q-page padding>
    <!-- content -->
    <div v-if="tagList.success" class="row justify-center">
      <q-card
        v-for="item in tagList.success"
        v-bind:key="item.id"
        @click.native="$router.push(`/tags/${item._id}`)"
        :class="[!item.active ? 'disabled' : '', 'col-md-2 col-xs-5 q-ma-xs text-bold']"
        :style="getColors(item.colors)"
      >
        <q-card-section class="column text-center cursor-pointer">{{ item.name }}</q-card-section>
      </q-card>
    </div>
    <!-- fab -->
    <floating-action-button next='/tags/new' />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('tag')

import FloatingActionButton from '../components/FloatingActionButton'

// TODO: tag search
export default {
  name: 'TagList',
  components: {
    FloatingActionButton
  },
  computed: {
    ...mapState({
      tagList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findTags: 'find'
    }),
    getColors (colors) {
      return {
        backgroundColor: colors && colors.length > 0 ? colors[0] : '#000',
        color: colors && colors.length > 1 ? colors[1] : '#FFF'
      }
    }
  },
  created () {
    this.findTags()
  }
}
</script>
