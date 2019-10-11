export default {
  state: {
    names: []
  },
  mutations: {
    CHANGE_TABS(state, names) {
      if (state.names !== names) {
        state.names = names
      }
    }
  }
}
