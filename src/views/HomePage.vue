<template>
  <div>
    <!-- <ImgBanner imgSrc="https://source.unsplash.com/random/1600x900"> -->
    <!-- <ImgBanner imgSrc="https://thewallpaper.co//wp-content/uploads/2016/10/free-images-1600x900-wallpapers-full-hd-download-high-definiton-wallpapers-desktop-images-colourful-free-download-wallpapers-cool-best-1600x900.jpg">
      <div style="line-height:1.2em;" slot="text">상어는 영어로<br>죠습니다</div>
    </ImgBanner> -->

    <!-- img slide by hooper -->
    <!--
      npm install @chenfengyuan/vue-carousel vue vue-template-compiler

      import VueCarousel from '@chenfengyuan/vue-carousel';
      Vue.use(VueCarousel);

      npm install hooper
    -->
    <hooper :infiniteScroll="true" :wheelControl="false" :autoPlay="true" :playSpeed="3000">
      <slide v-for="item in items">
          <ImgBanner :imgSrc="item.imgSrc">
          <div class="main_img" slot="text">
            <strong>
              <p class="main_font">{{item.text}}</p>
            </strong>
          </div>
        </ImgBanner>
      </slide>

<!--    </v-layout>-->
    <hooper-navigation slot="hooper-addons"></hooper-navigation>
    <hooper-pagination slot="hooper-addons"></hooper-pagination>
  </hooper>

  <!-- Profile -->
  <div class="margin_top">
    <Profile></Profile>
  </div>

  <!-- About Me
  <v-layout my-5>
      <v-flex xs12 sm7 text-xs-center text-sm-left>
        <h2 style="font-size:3vw;">About Us</h2>
        <hr>
        <br>
        <p class="mr-4" style="font-size:1.5vw;">안녕하세요, SSAFY18조 입니다<br/>저는 Vue를 배우고 있는 초급 개발자 입니다!
          다룰 줄 아는 언어는 JAVA가 있고 웹 프로그래밍을 해보았습니다.<br>상어는 참 귀엽습니다 상어 너무 좋아요</p>
      </v-flex>
      <v-flex sm1></v-flex>
      <v-flex hidden-xs12 sm4>
        <v-img :src="getImgUrl('profile_18.jpg')" aspect-ratio="1"/>
      </v-flex>
  </v-layout>
-->

      <!-- Portfolio -->
      <!-- <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center" href="/portfolio">Portfolio</h2>
          <PortfolioList></PortfolioList>
        </v-flex>
      </v-layout> -->

      <!-- Post -->
      <!-- <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center" href="/post">Post</h2>
          <PostList :column="2"></PostList>
        </v-flex>
      </v-layout> -->

      <!-- Github -->
      <v-container>
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center main_subtitle">Project</h2>
          <RepositoryList></RepositoryList>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from '../components/ImgBanner'
import PortfolioList from '../components/PortfolioList'
import PostList from '../components/PostList'
import RepositoryList from '../components/RepositoryList'
import Profile from '../components/Profile.vue'
import { Hooper,
  Slide,
  Navigation as HooperNavigation,
  Pagination as HooperPagination } from 'hooper';

export default {
	name: 'HomePage',
	components: {
		ImgBanner,
		PortfolioList,
		PostList,
		RepositoryList,
    Hooper,
    Slide,
    HooperNavigation,
    HooperPagination,
    Profile,
	},
  data () {
    return {
      selector: '#first',
      selected: 'Button',
      show: true,
      items: [{
          imgSrc: 'https://i.imgur.com/tS1b8uI.png',
          text: '',
      },{
          imgSrc: 'https://source.unsplash.com/category/travel/1600x1200',
          text: '"Be strong,"',
      },
     ]
    }
  },
	methods: {
		getImgUrl(img) {
			return require('../assets/' + img)
		}
  },

}

var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");

if (isIOSChrome) {
   // is Google Chrome on IOS
} else if(  isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && isOpera === false && isIEedge === false) {

} else {
   swal("해당사이트는 크롬에 최적화 되어있습니다.")
}
</script>

<style>
.main_img{
  line-height:1.2em;
  font-size: 5vw;
  color: black;
  opacity: 0.85;
}
.margin_top{
  margin-top: -50px;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
.main_font{
  color:#FCFFFC;
  font-weight: 800;
  text-shadow: 2px 2px 2px black;
}
.main_subtitle{
  font-size: 30px;
  text-shadow: 1px 1px 1px #888888;
}
</style>
