import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		accessToken: '',
    user: '',
    userInfo:'',
    portfolioChange:'',
    postChange:'',
    commentChange:'',
    recommentChange:'',
    check: false,
  },
  getters : {
    USERINFO : state => {
      return state.userInfo;
    },
  },
})
