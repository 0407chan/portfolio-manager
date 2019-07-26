import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		accessToken: '',
    user: '',
    userInfo:'',
    check: false
  },

  getters : {
    USERINFO : state => {
      return state.userInfo;
    }
  },
})
