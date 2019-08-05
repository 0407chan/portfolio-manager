<template>
<div>
  <v-container>
    <v-layout my-5 wrap>
      <v-flex xs12 md5>
        <div class="img_div">
          <div class="img_scale">
            <img v-bind:src="portfolio.img" width="100%" />
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm1>
      </v-flex>
      <v-flex xs12 md6>
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

    </v-layout>
    <v-flex xs12 text-xs-center>
      <v-btn round v-if="user&&user.classify!=='방문자'" color="two" dark :to="{ name: 'modifyportfolio', params: {id: portfolio.id} }">
        <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
      </v-btn>
      <v-btn round v-if="user&&user.classify!=='방문자'" color="three" dark v-on:click="deletePortfolio">
        <v-icon size="17" class="mr-2">delete</v-icon>Delete
      </v-btn>
      <v-btn round color="four" dark :to="{name:'portfolio'}">
        <v-icon size="17" class="mr-2">fa-undo</v-icon>Back
      </v-btn>
    </v-flex>
    <!-- <v-flex xs12>
      <div id="disqus_thread"></div>
    </v-flex> -->
    <v-flex xs12>
      <PortfolioComment :id="portfolio.id"></PortfolioComment>
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
import PortfolioComment from '../components/PortfolioComment'


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
      user: ""
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.user = await FirebaseService.getUserData();
      }

    });
    this.id = this.$route.params.id;
  },

  components: {
    ImgBanner,
    PortfolioList,
    PortfolioComment,
  },

  mounted() {
    this.getPortfolio(this.id);
  },
  methods: {
    async deletePortfolio() {
      await this.getPortfolio(this.id);
      if(this.portfolio.comments){
        for(var i =0; i<this.portfolio.comments.length; i++)
        FirebaseService.deletePortfolioComment(this.id, this.portfolio.comments[i]);
      }
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
