
<template>
<v-footer dark height="auto" >
  <v-card flat tile class="five darken-2 white--text text-xs-center footer-shadow flex">
     <FooterWeather></FooterWeather>
    <v-card-text style="padding: 0 0 10px 0">
      <v-layout>
        <v-flex md6 sm12 text-xs-center text-md-right>
          <v-btn v-for="icon in icons" :key="icon.title" class="mx-3 white--text footer-opacity" icon @click="move(icon.link)">
              <v-icon size="24px">{{ icon.title }}</v-icon>
          </v-btn>
        </v-flex>
        <v-flex md6 text-xs-left hidden-sm-and-down>
          <v-btn v-for="git in gits" :key="git.name" class="mx-3 white--text footer-opacity" icon @click="move(git.link)" :title='git.name'>
              {{git.iconimg}}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</v-footer>
</template>

<script>
import FooterWeather from "../components/FooterWeather.vue";

export default {
  components:{
    FooterWeather,
  },
  data: () => ({
      icons: [{
          title: 'fa-facebook',
          link: 'https://www.facebook.com/'
        },
        {
          title: 'fa-bold',
          link: 'https://blog.naver.com/zettank'
        },
        {
          title: 'fa-google',
          link: 'https://www.google.co.kr/'
        },
        {
          title: 'fa-gitlab',
          link: 'https://lab.ssafy.com/jisssh/webmobile-sub2'
        }
      ],
      gits: [{
        iconimg: 'Zettank',
        name: 'Zettank, Hyungwon Lee',
        link: 'https://lab.ssafy.com/zettank'
      },{
        iconimg: 'Chris',
        name: 'Chris, Chanho Lee',
        link: 'https://lab.ssafy.com/ChrisRhee'
      },{
        iconimg: 'Stupid',
        name: 'Stupid, Jongyeon Lee',
        link: 'https://lab.ssafy.com/stupid'
      },{
        iconimg: 'Jisssh',
        name: 'Jisssh, Sanghyeon Ji',
        link: 'https://lab.ssafy.com/jisssh'
      },
    ],
  }),
    methods: {
      move: function(link) {
        var openNewWindow = window.open("about:blank");
        openNewWindow.location.href=link;
      }
    }
}
</script>

<style>
.footer-shadow{
  width:100vw;
  box-shadow: 3px 3px 3px #656c85 inset;
}
.footer-opacity{
  opacity: 0.8;
}
</style>
