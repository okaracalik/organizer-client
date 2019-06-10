<template>
  <div v-if="isEmbedded || isModal" class="q-mt-md row justify-between">
    <q-btn
      :round="isEmbedded"
      :color="isModal ? 'positive' : 'light-blue'"
      @click="() => $emit(`form-save`)"
      :icon="isModal ? 'mdi-content-save' : 'mdi-plus'"
    />
    <q-btn v-if="canShowCancel" color="warning" @click="() => $emit(`form-cancel`)" icon="mdi-undo"/>
    <q-btn
      v-if="isEdit"
      :round="isEmbedded"
      :color="isModal ? 'negative' : 'deep-orange'"
      @click="() => $emit(`form-erase`)"
      icon="mdi-delete-forever-outline"
    />
  </div>
  <q-page-sticky v-else class="row" position="top" :offset="[0, 18]">
    <q-btn
      class="col q-mr-lg"
      color="positive"
      @click="() => $emit(`form-save`)"
      icon="mdi-content-save"
    />
    <q-btn
      :class="[isEdit ? 'q-mx-lg' : 'q-ml-lg', 'col' ]"
      color="warning"
      @click="() => $emit(`form-cancel`)"
      icon="mdi-undo"
    />
    <q-btn
      class="col q-ml-lg"
      color="negative"
      @click="() => $emit(`form-erase`)"
      icon="mdi-delete-forever-outline"
      v-if="isEdit"
    />
  </q-page-sticky>
</template>

<script>
export default {
  name: 'FormActionButtons',
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    isModal: {
      type: Boolean,
      default: false
    },
    isEmbedded: {
      type: Boolean,
      default: false
    },
    canShowCancel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isPage () {
      return !(this.isModal || this.isEmbedded)
    }
  }
}
</script>
