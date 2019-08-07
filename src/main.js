import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import 'font-awesome/css/font-awesome.min.css'
import VueMarkdown from 'vue-markdown'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import swal from 'sweetalert';
import Notifications from 'vue-notification'
import axios from 'axios'

Vue.prototype.$http = axios
import firebaseApp from 'firebase/app'
import firebaseMy from './services/FirebaseService'
import firebase from 'firebase'

import VueCarousel from '@chenfengyuan/vue-carousel';
import VueRouter from 'vue-router';

Vue.use(VueCarousel);
Vue.component('vue-markdown', VueMarkdown);
Vue.config.productionTip = false
Vue.use(Notifications)
// var router = new VueRouter();
router.beforeEach((to, from, next) => {

	// firebaseApp.auth().onAuthStateChanged(user => {
		// var username = null;
		// if (user) {
		// 	username = store.state.user.displayName;
		// 	if(username === null) {
		// 		username = user.email.split('@')[0];
		// 	}
		// }
		// else
		// 	username = 'Guest';

		// firebaseMy.postPageLog(username, from.name, to.name);
		// // console.log("username : "+username+", from : "+from.name+", to : "+to.name);
	  // });

	next();
})


Vue.use(Vuetify, {
	iconfont: 'md',
	theme: {
		primary: '#3f51b5',
		secondary: '#b0bec5',
		accent: '#8c9eff',
		error: '#b71c1c',
		one: '#FCFFFC',
		two: '#ff7761',
		three: '#fdc23e',
		four: '#f9a11b',
		five: '#274555',
		profile1: '#84B1ED',
		profile2: '#ee7785',
		profile3: '#a5d296'

	}
})

Vue.use(VueSimplemde)

new Vue({
  router,
  store,
  created() {
	this.$store.state.check = false;
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			this.$store.state.check = true;
			this.$store.state.user = user;
			this.$store.state.accessToken = user.accessToken;
		} else {
			this.$store.state.check = false;
		}
	})
},
  render: h => h(App)
}).$mount('#app')
