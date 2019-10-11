export const state = () => ({
  names: []
})

export const mutations = {
  CHANGE_TABS(state, names) {
    if (state.names !== names) {
      state.names = names
    }
  }
}

