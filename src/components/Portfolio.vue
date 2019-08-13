<style>
#title1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  max-height: 32px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #181818;
  font-size: 18px;
  margin: auto;
  text-align: center;
}

#body1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  max-height: 48px;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

a {
  text-decoration: none;
}

.v-card.portfoliolist {
  transition: opacity .4s ease-in-out;
}

.v-card.portfoliolist:not(.on-hover) {
  opacity: 0.6;
}

.show-btns.portfoliolist {
  color: rgba(255, 255, 255, 1) !important;
}
</style>

<template>
<v-layout align-center justify-center wrap fill-height>
  <template>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 24 : 2" :class="{ 'on-hover': hover }" :close-delay="80" class="portfoliolist">
        <v-img :src="imgSrc" height="250px" min-width="350px">
          <v-card-title class="title white--text fill-height">
            <v-layout fill-height column justify-space-between>
              <p class="mt-4 headline font-weight-bold font-italic text-left"><span v-html="highlight(title,search)"></span></p>
              <!--   <div id="title1"><span v-html="highlight(title,search)"></span></div>-->

              <div>
                <p class="my-2 body-1 font-weight-bold font-italic text-left">
                  <span v-html="highlight(name,search)"></span>
                </p>
                <p class="caption font-weight-medium font-italic text-left">
                  <span v-html="highlight(date.toString().substring(0,24),search)"></span>
                </p>
              </div>

            </v-layout>
          </v-card-title>
        </v-img>
      </v-card>
    </v-hover>
  </template>
</v-layout>





<!--  <v-card hover>-->
<!--    <v-img :src="imgSrc" height="250px">-->
<!--    </v-img>-->
<!--    <v-card-title primary-title>-->
<!--      <v-flex>-->
<!--&lt;!&ndash;        <div id="title1"><span v-html="highlight(title,search)"></span></div>&ndash;&gt;-->
<!--      </v-flex>-->
<!--    </v-card-title>-->
<!--  </v-card>-->
</template>

<script>
export default {
  name: 'Portfolio',
  props: {
    date: {
      type: String
    },
    title: {
      type: String
    },
    body: {
      type: String
    },
    imgSrc: {
      type: String
    },
    name: {
      type: String
    },
    date: {
      type: String
    },
    id: {
      type: String
    },
    search: {
      type: String
    },
  },
  data() {
    return {
      //
    }
  },
  methods: {
    highlight(value, search) {
      var iQuery = new RegExp(search, "ig");
      return value.toString().replace(iQuery, function(matchedTxt, a, b) {
        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
      });
    }
  }
}
</script>
