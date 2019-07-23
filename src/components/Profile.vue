
<template>
<!-- People -->
<v-layout my-5 wrap>
  <v-flex v-for="profile in developer" xs12 md4>
    <v-hover>
      <v-card slot-scope="{ hover }" class="mx-auto" color="grey lighten-4" max-width="600">
        <v-img :aspect-ratio="1.35" :src='profile.picture'>
          <!-- text div-->
          <v-fade-transition>
            <div v-if="hover" class="d-flex darken-2 transition-fast-in-fast-out v-card--reveal display-1 white--text hover_div" style="opacity:1">
              <v-container>
                <v-layout wrap>
                  <v-flex xs12>
                    <br><br><br>
                  </v-flex>
                  <v-flex xs10 style="z-index:1000">
                    <span class="headline profile_id">
                      {{profile.id}}
                    </span>
                  </v-flex>
                  <v-flex xs2>
                    <span class="headline">
                      <v-btn class="mx-3 white--text" icon @click="move(profile.gitlab)" style="z-index:1000">
                          <v-icon size="24px" style="text-shadow: 1px 1px 1px black;">fa-gitlab</v-icon>
                      </v-btn>
                    </span>
                  </v-flex>
                  <v-flex xs12>
                    <hr style="z-index:1000">
                  </v-flex>
                  <v-flex xs12 style="z-index:1000">
                    <span class="introduce">{{profile.introduce}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
            <div v-if="!hover" class="d-flex darken-2 v-card--reveal display-3 white--text hover_div" style="opacity:0.9" :class='profile.color'>
              {{profile.id}}
            </div>
          </v-fade-transition>
          <!-- cover div -->
          <v-fade-transition>
            <div v-if="hover" class="d-flex darken-2 v-card--reveal display-3 white--text hover_div" style="opacity:0.25" :class='profile.color'>
            </div>
          </v-fade-transition>
        </v-img>
      </v-card>
    </v-hover>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  name: "FooterWeather",
  data: () => ({
    developer: [{
      id: 'Zettank',
      picture: 'https://i.imgur.com/CCeS6ey.jpg',
      introduce: '안녕하세요!',
      gitlab: 'https://lab.ssafy.com/zettank',
      color: 'profile1'
    }, {
      id: 'Chanolee',
      picture: 'https://i.imgur.com/Z4DeSnd.jpg',
      introduce: '반갑습니다!',
      gitlab: 'https://lab.ssafy.com/ChrisRhee',
      color: 'profile2'
    }, {
      id: 'Jisssh',
      picture: 'https://i.imgur.com/ym1fn9f.jpg',
      introduce: '좋은하루되세요.',
      gitlab: 'https://lab.ssafy.com/jisssh',
      color: 'profile3'
    }, ],
  }),
  methods: {
    move: function(link) {
      var openNewWindow = window.open("about:blank");
      openNewWindow.location.href=link;
    }
  }
};
</script>

<style>
.profile_id{
  text-shadow: 1px 1px 1px black;
}
.introduce{
  font-size: 15pt;
  text-shadow: 1px 1px 1px black;
}
.hover_div{
  height: 100%;
}
.margin_top_-20 {
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
</style>
