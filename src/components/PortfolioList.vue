<template>
<v-layout mt-5 wrap>
  <template v-if="portfolios != undefined">
    <v-flex xs12 text-xs-center>
      <v-text-field label="Search" v-model="search"></v-text-field>
    </v-flex>
    <v-flex v-for="i in searchList.length > limit ? limit : searchList.length" xs12 sm6 lg4>
      <router-link :to="{ name: 'portfolioview', params: {id: searchList[i-1].id} }">
        <Portfolio class="ma-3" :date="searchList[i-1].created_at.toString()" :title="searchList[i-1].title" :body="searchList[i-1].body" :imgSrc="searchList[i-1].img" :search="search"></Portfolio>
      </router-link>
    </v-flex>
    <v-alert v-if="errorInit" :value="searchList.length == 0" color="error" icon="warning" outline transition="scale-transition">
      "{{this.search}}" is not in Portfolis
    </v-alert>
    <v-flex xs12 text-xs-center round my-5>
      <v-btn flat v-if="searchList.length > limit" color="black" dark v-on:click="loadMorePortfolios">
        <v-icon size="17" class="mr-2">keyboard_arrow_down</v-icon>More
      </v-btn>
    </v-flex>
  </template>
  <template v-else>
    <v-layout align-center justify-center style="min-height:400px;" >
      <v-flex xs8 text-xs-center >
        <v-alert :value="portfolios.length == 0" color="error" icon="warning" outline transition="scale-transition">
          등록된 포트폴리오가 없습니다.
        </v-alert>
        <v-btn color="two" round dark v-on:click="writeportfolio">
          <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
        </v-btn>
      </v-flex>
    </v-layout>
  </template>
</v-layout>
</template>
<script>
import Portfolio from '@/components/Portfolio'
import FirebaseService from '@/services/FirebaseService'
import firebase from 'firebase/app'


export default {
  name: 'PortfoliosList',
  props: {
    limit: {
      type: Number,
    },
  },
  data() {
    return {
      portfolios: [],
      user: "",
      scrolled: '',
      search: '',
      searchList: [],
      errorInit: false,
      isSearchEmpty: true,
    }
  },
  components: {
    Portfolio
  },
  mounted() {
    this.getPortfolios();
    // this.getPortfoliosRealtime();
  },
  methods: {
    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfolios();
      // this.portfolios = await this.getPortfoliosRealtime();
      // console.log("왜안돼",this.portfolios);
      this.errorInit = true;
      this.searchList = [];
      for (var i = 0; i < this.portfolios.length; i++) {
        this.searchList.push(this.portfolios[i]);
      }
      this.isSearchEmpty = false;
    },

    async getPortfoliosRealtime(){
      console.log("이거는?");
      let a = await FirebaseService.getPortfoliosRealtime();

      console.log("이거는?",a);
    },
    loadMorePortfolios() {
      this.limit += 3;
    },
    writeportfolio(){
      this.$router.push('writeportfolio');
    }
  },

  watch: {
    search() {
      if (this.search.length == 0) {
        var len = this.portfolios.length;
        this.searchList = [];
        for (var i = 0; i < len; i++) {
          this.searchList.push(this.portfolios[i]);
        }
      } else {
        this.searchList = [];
        var len = this.portfolios.length;
        var search = this.search;
        search = search.toLowerCase();
        for (var i = 0; i < len; i++) {
          var a = this.portfolios[i].title.toLowerCase()
          if (a.includes(search)) {
            this.searchList.push(this.portfolios[i]);
          }
        }
      }
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }
}
</script>
<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
