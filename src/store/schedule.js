import api from '@/api'

const state = {
  weeks: [],
  month: [],
  loadedMonth: '',
  selectedAssignee: ''
}

const getters = {
  selectedAssignee: state => state.selectedAssignee
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
  loadMonth ({ state, commit }, { month }) {
    if (state.loadedMonth === month && state.month) return Promise.resolve(state.month)
    return api.schedule.month({ month })
      .then(res => {
        const weeks = res.data.result
        commit('LOAD_MONTH', { month: weeks, loadedMonth: month })
        return weeks
      })
  },
  scrapeWeek ({ commit }, { weekID }) {
    return api.schedule.scrape({ weekID })
      .then(res => {
        const scrapedWeek = res.data.result
        commit('UPDATE_WEEK', scrapedWeek)
        return scrapedWeek
      })
  },
  updateAssignment ({ commit }, { weekID, name, assignment }) {
    return api.schedule.updateAssignment({ weekID, name, assignment })
      .then(res => {
        const { week, members } = res.data.result
        commit('UPDATE_WEEK', week)
        for (const member of members) {
          commit('congregation/UPDATE_MEMBER', member, { root: true })
        }
        return week
      })
  },
  updateWeekType ({ commit }, { weekID, type }) {
    return api.schedule.updateWeekType({ weekID, type })
      .then(res => {
        const { week, members } = res.data.result
        commit('UPDATE_WEEK', week)
        for (const member of members) {
          commit('congregation/UPDATE_MEMBER', member, { root: true })
        }
        return week
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
  },
  CLEAR_WEEKS (state) {
    Object.assign(state, { weeks: [] })
  },
  LOAD_MONTH (state, { month, loadedMonth }) {
    Object.assign(state, { month, loadedMonth })
  },
  UPDATE_SELECTED_ASSIGNEE (state, payload) {
    Object.assign(state, { selectedAssignee: payload })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
