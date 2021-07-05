import { getInfo } from '@/api/statistical/reports'
import { isEmpty } from 'lodash'

export default {
  namespaced: true,
  state: {
    locationData: {},
  },
  mutations: {
  },
  actions: {
    async loadLocationData ({ state }) {
      state.locationData = await getInfo()
    }
  }
}
