<template>
<div>
  <v-container>
    <v-layout my-5 wrap>
      <v-flex xs12 sm5>
        <div class="img_div">
          <div class="img_scale">
            <img v-bind:src="portfolio.img" width="100%" />
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm1>
      </v-flex>
      <v-flex xs12 sm6>
        <v-flex xs12 text-xs-center>
          <h2>{{portfolio.title}} </h2>
        </v-flex>
        <v-flex xs12>
          <br><hr><br>
        </v-flex>
        <v-flex xs12 test-xs-left>
          <vue-markdown :source="portfolio.body"></vue-markdown>
        </v-flex>
      </v-flex>
        <!-- <vue-markdown :source="portfolio.body" style="margin-left:1vw; margin-right:3vw;"></vue-markdown> -->
      </v-flex>

    </v-layout>
    <v-flex xs12 text-xs-center>
      <v-btn round v-if="username" color="two" dark :to="{ name: 'modifyportfolio', params: {id: portfolio.id} }">
        <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
      </v-btn>
      <v-btn round v-if="username" color="three" dark v-on:click="deletePortfolio">
        <v-icon size="17" class="mr-2">delete</v-icon>Delete
      </v-btn>
      <v-btn round color="four" dark :to="{name:'portfolio'}">
        <v-icon size="17" class="mr-2">fa-undo</v-icon>Back
      </v-btn>
    </v-flex>
  </v-container>
</div>
</template>
<script>
import ImgBanner from '../components/ImgBanner'
import FirebaseService from '@/services/FirebaseService'
import PortfolioList from '../components/PortfolioList'
import Portfolio from '@/components/Portfolio'
import firebase from "firebase/app"
import firebaseApp from 'firebase/app'


export default {
  name: 'PortfolioViewPage',
  data() {
    return {
      heightt: 0,
      title: '',
      body: '',
      img: '',
      index: 0,
      portfolio: '',
      username: ""
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
      if (!this.user) {
        this.username = ""
      } else {
        this.username = 'NONE'
      }

    });
    this.id = this.$route.params.id;
  },

  components: {
    ImgBanner,
    PortfolioList
  },

  mounted() {
    this.getPortfolio(this.id);
  },
  methods: {
    async deletePortfolio() {
      await FirebaseService.deletePortfolio(this.id);
      this.$router.push({
        name: "portfolio"
      });
    },
    async getPortfolio(id) {
      this.portfolio = await FirebaseService.getPortfolio(id);
    },
  }
}
</script>
<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
.img_scale{
  transform: scale(1);
-webkit-transform: scale(1);
-moz-transform: scale(1);
-ms-transform: scale(1);
-o-transform: scale(1);
transition: all 0.3s ease-in-out;   /* 부드러운 모션을 위해 추가*/
}
.img_scale:hover{
  transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -ms-transform: scale(1.2);
  -o-transform: scale(1.2);
}
.img_div{
  overflow:hidden
}
</style>
