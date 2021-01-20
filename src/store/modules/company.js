const state = {
  id: undefined,
  name: ""
};

const mutations = {
  SET_COMPANY_INFO: (state, info) => {
    state.id = info.id;
    state.name = info.companyName;
  },
  CLEAR_COMPANY_INFO: state => {
    state.id = undefined;
    state.name = "";
  }
};

const actions = {
  setCompanyInfo({ commit }, info) {
    return new Promise(resolve => {
      commit("SET_COMPANY_INFO", info);
      resolve(info);
    });
  },

  clearCompanyInfo({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_COMPANY_INFO");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
