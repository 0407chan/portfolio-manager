import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/HomePage.vue'
import PostPage from './views/PostPage.vue'
// import PostViewPage from './views/PostView.vue'
import PostViewPage from './views/PostPage.vue'
import PostWriterPage from './views/PostWriter.vue'
import PortfolioPage from './views/PortfolioPage.vue'
import PortfolioViewPage from './views/PortfolioView.vue'
import PortfolioWriterPage from './views/PortfolioWriter.vue'

import ModifyPortfolioPage from './views/PortfolioWriter.vue'
import ModifyPostPage from './views/PostWriter.vue'
import UserDetail from './views/UserDetail.vue'
import MyPage from './views/UserDetail.vue'

import AdminPage from './views/AdminPage.vue'

import UserDetailTest from './test/UserDetailTest.vue'
import AdminPageTest from './test/AdminPageTest.vue'
import LoginTest from './test/LoginTest.vue'
import InputTest from './test/InputTest.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
		{
			path: '/',
			name: 'home',
			component: HomePage
		},
		{
			path: '/post',
			name: 'post',
			component: PostPage
		},
    {
			path: '/writepost',
			name: 'writepost',
			component: PostWriterPage
		},
    {
			path: '/postview/:index',
			name: 'postview',
			component: PostViewPage
		},
    {
			path: '/modifypost/:id',
			name: 'modifypost',
			component: ModifyPostPage
		},
		{
			path: '/portfolio',
			name: 'portfolio',
			component: PortfolioPage
		},
    {
			path: '/writeportfolio',
			name: 'writeportfolio',
			component: PortfolioWriterPage
		},
    {
			path: '/modifyportfolio/:id',
			name: 'modifyportfolio',
			component: ModifyPortfolioPage
		},

    {
			path: '/portfolioview/:id',
			name: 'portfolioview',
			component: PortfolioViewPage
		},

    {
			path: '/admin',
			name: 'admin',
			component: AdminPage
  	},
  	{
			path: '/userinfo/:id',
			name: 'userinfo',
			component: UserDetail
  	},


    /********************\
   \     test rounter     \
    \********************/
    {
      path: '/test4',
      name: 'userdetailtest',
      component: UserDetailTest
    },
    {
      path: '/test3',
      name: 'inputtest',
      component: InputTest
    },
    {
      path: '/test2',
      name: 'admintest',
      component: AdminPageTest
    },
    {
      path: '/test1',
      name: 'logintest',
      component: LoginTest
    },


  ]
})
