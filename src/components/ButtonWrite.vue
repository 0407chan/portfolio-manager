<template>
  <v-btn
    fab
    fixed
    color='four'
    v-if="writeAuthority&&visible"
    :class="{active:true, moved: isActive}"
    v-on:click="currpage"
    dark
  >
    <v-icon>
      fa-pencil
    </v-icon>
  </v-btn>
</template>

  <script>
  import firebase from "firebase/app";
  import FirebaseService from "@/services/FirebaseService";
    export default {

      data() {
    		return {
          type: 'number',
    			scrolled: false,
          number: 0,
          duration: 300,
          offset: 0,

          visible:true,
          hover: false,

          isActive: false,
          page:'',

          direction: 'top',
          fab: false,
          fling: false,

          tabs: null,
          top: false,
          right: true,
          bottom: true,
          left: false,
          transition: 'slide-y-reverse-transition',

          user: '',
          writeAuthority: '',
          currPage:[],
    		}
    	},

      mounted(){
        this.init();
        this.getUserData();
      },
      methods: {
        init(){
          this.currPage = window.location.href.split('/')
          if (this.currPage[3] =='post' || this.currPage[3] =='portfolio' || this.currPage[3] =='postview'){
            this.visible = true;
          }else {
            this.visible = false;
          }
        },
        handleScroll () {
          this.isActive = window.scrollY > 0;
        },
        currpage(){
          this.currPage = window.location.href.split('/')
          if(this.currPage[3] ==='post'){
            this.$router.push('writepost');
          }else if(this.currPage[3] ==='portfolio'){
            this.$router.push('writeportfolio');
          }else if(this.currPage[3] ==='postview'){
            this.$router.push('../writeportfolio');
          }
        },
        async getUserData(){
          const result = await FirebaseService.getUserData();
          this.writeAuthority = result.classfy
    },
      },

      beforeMount () {
        window.addEventListener('scroll', this.handleScroll);
      },
      beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
      },

      computed: {

      },

      watch:{
        $route (to, from){
          this.currPage = window.location.href.split('/')
          if (this.currPage[3] =='post' || this.currPage[3] =='portfolio' || this.currPage[3] =='postview'){
            this.visible = true;
          }else {
            this.visible = false;
          }
        }
      },
      created() {
        firebase.auth().onAuthStateChanged(async user => {
            this.user = user;
            if (user) {
              var result = await FirebaseService.getUserData();
              if (result.classify !== '방문자') {
                this.writeAuthority = true
              }
            }
            else {
              this.writeAuthority = false
            }

          });
      }
    }
</script>

<style>
  .active {
    position: absolute;
    bottom: 15px;
    right: 16px;
    transition:all 0.5s easy;
  }
  .moved {
    bottom:80px
  }
</style>
