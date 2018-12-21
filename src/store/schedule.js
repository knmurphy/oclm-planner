import api from '@/api'

const state = {
  weeks: []
}

const actions = {
  loadWeek ({ state, commit }, { date }) {
    const week = state.weeks.find(w => w.date === date)
    if (week) return Promise.resolve(week)
    return api.schedule.week({ date })
      .then(res => {
        const week = res.data.result
        commit('LOAD_WEEK', week)
        return week
      })
  },
  scrapeWeek ({ commit }, { date }) {
    return api.schedule.scrape({ date })
      .then(res => {
        const week = res.data.result
        commit('LOAD_WEEK', week)
        return week
      })
  },
  updateAssignment ({ commit }, { weekID, name, assignment }) {
    return api.schedule.updateAssignment({ weekID, name, assignment })
      .then(res => {
        const newWeek = res.data.result
        commit('UPDATE_WEEK', newWeek)
        return newWeek
      })
  }
}

const mutations = {
  LOAD_WEEK (state, payload) {
    state.weeks.push(payload)
  },
  UPDATE_WEEK (state, payload) {
    const prevIndex = state.weeks.find(w => w._id === payload._id)
    state.weeks.splice(prevIndex, 1, payload)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
