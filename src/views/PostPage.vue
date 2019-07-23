<template>
  <div>
    <v-layout my-4 mx-3>
      <Calendar></Calendar>
    </v-layout>
      <!-- Post -->
      <v-container>
      <v-layout>
        <v-flex xs12>
          <PostList :limits="lim"></PostList>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
import ImgBanner from '../components/ImgBanner'
import PostList from '../components/PostList'
import Calendar from '../components/Calendar'

export default {
	name: 'PostPage',
	components: {
		ImgBanner,
    PostList,
    Calendar,
	},

  data(){
    return{
      lim: 3,
    }
  },

  methods: {
    handleScroll () {
      var limit = document.body.offsetHeight - window.innerHeight;
      if(window.scrollY >= limit - 300){
        this.lim+=3;
      }
    }
  },

  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>
