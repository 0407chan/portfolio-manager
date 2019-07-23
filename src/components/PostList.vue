<template>
<v-layout row wrap>
  <v-expansion-panel focusable header-icon="clear" width="100%">
    <v-expansion-panel-content v-for="i in posts.length > limits ? limits : posts.length" expand-icon="arrow_drop_down">
      <template v-slot:header>
        <v-flex sm12 md8>{{posts[i - 1].title}}</v-flex>
        <v-flex hidden-sm-and-down md4>
          <div v-if='posts[i-1].writer'>작성자 : {{posts[i-1].writer}}</div>
          <div v-else>작성자 : {{posts[i-1].writer2}}</div>
        </v-flex>
        <!-- <v-flex xs2>작성자 : {{posts[i-1].writer2}}</v-flex>       -->
      </template>
      <v-card>
        <v-card-text>
          <Post :id="posts[i-1].id" :date="posts[i - 1].created_at" :title="posts[i - 1].title" :body="posts[i - 1].body" :writer="posts[i-1].writer" :writer2="posts[i-1].writer2"></Post>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</v-layout>

<!-- post table with expansion panel -->
<!--
  <v-layout>
  <v-card width="100%" elevation="1">
    <v-card-title>
      POSTS
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="posts"
      :search="search"
    >
      <template v-slot:items="props">
        <td>{{ props.item.created_at }}</td>
        <td class="text-xs-left">{{ props.item.title }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</v-layout>
-->
</template>
<script>
import Post from '@/components/Post'
import FirebaseService from '@/services/FirebaseService'
import firebase from 'firebase/app'

export default {
  name: 'PostList',
  props: {
    column: {
      type: Number,
      default: 1
    },
    limits: {
      type: Number,
    },
    loadMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      posts: [],
      user: "",
    }
  },
  components: {
    Post
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    async getPosts() {
      this.posts = await FirebaseService.getPosts()
    },
    loadMorePosts() {
      this.limits += 4
    },

  },
  created() {
    this.getPosts();
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
