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
  import * as easings from 'vuetify/es5/util/easing-patterns'
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
          easing: 'easeInOutCubic',
          easings: Object.keys(easings),

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
    		}
    	},

      mounted(){
        this.init();
        this.getUserData();
        
      },
      methods: {
        init(){
          var a = window.location.href.substring(8).indexOf('/');
          this.page = window.location.href.substring(8).substring(a);
          if(this.page ==='/post' || this.page ==='/portfolio'){
            this.visible = true;
          }else {
            this.visible = false;
          }
        },
        handleScroll () {
          this.isActive = window.scrollY > 0;
        },
        currpage(){
          var a = window.location.href.substring(8).indexOf('/');
          this.page = window.location.href.substring(8).substring(a);

          if (this.page ==='/post' || this.page ==='/portfolio'){
            this.visible = true;
          }else {
            this.visible = false;
          }

          if(this.page ==='/post'){
            this.$router.push('writepost');
          }else if(this.page ==='/portfolio'){
            this.$router.push('writeportfolio');
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
          var a = window.location.href.substring(8).indexOf('/');
          this.page = window.location.href.substring(8).substring(a);
          if(this.page ==='/post' || this.page ==='/portfolio'){
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