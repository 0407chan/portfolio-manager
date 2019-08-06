<template>
  <div>
    <v-container v-if="user&&user.classify !=='방문자'">
      <v-layout wrap>
        <v-flex xs12 my-5>
          <v-text-field v-model="title" :rules="[rules.required]" autofocus label="Title"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <markdown-editor :highlight="true" v-model="body"></markdown-editor>
        </v-flex>
        <v-flex xs12 text-xs-center round my-5>
          <template v-if="id==null">
            <v-btn color="two" round dark v-on:click="postPost">
            <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
            </v-btn>
          </template>
          <template v-else>
            <v-btn color="two" round dark v-on:click="postPost">
            <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
            </v-btn>
          </template>

          <v-btn color="three" round dark :to="{name:'post'}">
            <v-icon size="17" class="mr-2">cancel</v-icon>Cancel
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <BlockAccess v-else-if="wait"></BlockAccess>
  </div>
</template>
<script>
import FirebaseService from "@/services/FirebaseService";
import PostList from "../components/PostList";
import firebase from "firebase";
import BlockAccess from "../components/BlockAccess"

export default {
  name: "PostWriterPage",

  data() {
    return {
      title: "",
      rules: {
        required: value => !!value || "Required."
      },
      title:'',
      body:'',
      post:'',
      id:'',
      user: '',
      wait: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.user = await FirebaseService.getUserData();
        this.wait = true;
      } else {
        this.wait = true
      }

    });
    this.id = this.$route.params.id
  },

  mounted(){
    if(this.id!=null){
      this.getPost(this.id);
    }
  },
  components: {
    PostList,
    BlockAccess
  },
  methods: {
    async postPost() {
      let result = await FirebaseService.getUserData();
      if(this.id==null){
        let res= await FirebaseService.postPost(this.title, this.body, result.name);
        await FirebaseService.addToPostList(res);
      }else{
        await FirebaseService.modifyPost(this.title, this.body ,this.id, result.name);
      }
      this.$router.push({
        name: "post"
      });
    },

    async getPost(id) {
			this.post = await FirebaseService.getPost(id);
      this.title = this.post.title;
      this.body = this.post.body;
		},
    async postWriteAndNotify () {
      let result = await FirebaseService.getUserData();
      if(this.id==null){
        let res= await FirebaseService.postPost(this.title, this.body, result.id, result.name);
        await FirebaseService.addToPostList(res);
      }else{
        await FirebaseService.modifyPost(this.title, this.body ,this.id, result.name);
      }
      this.$router.push({
        name: "post"
      });
      if (window.Notification) {
        Notification.requestPermission();
      }
      function pushNotification() {
        setTimeout(function () {
          notify();
        }, 1500);
      }
      pushNotification();
      function notify() {
        var notification = new Notification('EEEAZY Notification', {
          icon: 'https://i.imgur.com/wxV4WcW.png',
          body: '새 글이 등록되었습니다.',
        });
        notification.onclick = function () {
          window.open('http://localhost:8080/portfolio');
        };
      }
    }
  }
};
</script>
<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
