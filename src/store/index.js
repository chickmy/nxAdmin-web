import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import erp from './modules/erp'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    d2admin,
    erp,
  },
})
