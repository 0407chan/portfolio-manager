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
        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="four"
          ></v-progress-circular>
          <img :src="imageUrl" height="150" v-if="imageUrl" />

          <v-text-field
            label="Select Image"
            @click="pickFile"
            v-model="imageName"
            prepend-icon="attach_file"
            color="four"
          ></v-text-field>

          <input
            type="file"
            style="display: none"
            ref="image"
            accept="image/*"
            @change="onFilePicked"
          />
        </v-flex>
        <v-flex xs12 text-xs-center round my-5>
          <template v-if="id==null">
            <v-btn color="two" round dark v-on:click="portfolioWriteAndNotify">
            <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
            </v-btn>
          </template>
            <template v-else>
              <v-btn color="two" round dark v-on:click="portfolioWriteAndNotify">
              <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
              </v-btn>
            </template>

          <v-btn color="three" dark round :to="{name:'portfolio'}">
            <v-icon size="17" class="mr-2">cancel</v-icon>Cancel
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <BlockAccess v-else></BlockAccess>
  </div>
</template>
<script>
import FirebaseService from "@/services/FirebaseService";
import PortfolioList from "../components/PortfolioList";
import Portfolio from '@/components/Portfolio'
import axios from "axios";
import firebase from "firebase";
import BlockAccess from "../components/BlockAccess"

export default {
  name: "PortfolioWriterPage",

  data() {
    return {
      title: "",
      rules: {
        required: value => !!value || "Required."
      },
      body:"",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      loading:false,
      portfolio : "",
      path: "https://api.imgur.com/3/image",
      clientid: "aac995cb6f223ce",
      callback: "feedback",
      id: "",
      user: '',

    };
  },
  created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.user = await FirebaseService.getUserData();
      }

    });
    this.id = this.$route.params.id
  },
  mounted(){
    if(this.id!=null){
      this.getPortfolio(this.id);
    }
  },
  components: {
    PortfolioList,
    BlockAccess
  },
  methods: {
    async writePortfolio() {
      let result = await FirebaseService.getUserData();
      console.log(result)

      if(this.id==null){
        await FirebaseService.postPortfolio(this.title, this.body, this.imageUrl, result.name);
      }else{
        await FirebaseService.modifyPortfolio(this.title, this.body, this.imageUrl, this.id, result.name);
      }
      this.$router.push({
        name: "portfolio"
      });
    },

    async getPortfolio(id) {
			this.portfolio = await FirebaseService.getPortfolio(id);
      this.title = this.portfolio.title;
      this.body = this.portfolio.body;
      this.imageUrl = this.portfolio.img;
		},

    pickFile() {
      this.$refs.image.click();
    },
    setImageUrl(url){
      this.imageUrl = url;
    },
    onFilePicked(e) {
      this.imageUrl = '';
      const files = e.target.files;
      this.loading = true;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }

        let formData = new FormData();
        formData.append('image', files[0]); //required

        axios({
           method: 'POST',
           url: 'https://api.imgur.com/3/image',
           data: formData,
           headers: {
           Authorization: "Client-ID aac995cb6f223ce"
           },
           mimeType: 'multipart/form-data'
           }).then(res => {
             this.imageUrl = res.data.data.link;
             this.loading = false;
           }).catch(e => {
             console.log(e)
        });

      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    notification () {
      if (window.Notification) {
        Notification.requestPermission();
      }
      function pushNotification() {
        setTimeout(function () {
          notify();
        }, 1000);
      }
      pushNotification();
      function notify() {
        if (Notification.permission !== 'granted') {
          alert('notification is disabled');
        }
        else {
          var notification = new Notification('EEEAZY Notification', {
            icon: 'https://i.imgur.com/wxV4WcW.png',
            body: '새 글이 등록되었습니다.',
          });
          notification.onclick = function () {
            window.open('http://localhost:8080/portfolio');
          };
        }
      }
    },
    async portfolioWriteAndNotify () {
      let result = await FirebaseService.getUserData();

      if(this.id==null){
        await FirebaseService.postPortfolio(this.title, this.body, this.imageUrl, result.name);
      }else{
        await FirebaseService.modifyPortfolio(this.title, this.body, this.imageUrl, this.id, result.name);
      }
      this.$router.push({
        name: "portfolio"
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
  },

};
</script>
<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
