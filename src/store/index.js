import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import tag from './tag'
import occurrence from './occurrence'
import task from './task'
import log from './log'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      tag,
      occurrence,
      task,
      log
    }
  })

  return Store
}
