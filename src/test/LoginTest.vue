<template>
<v-layout align-center justify-center row fill-height elevation-5 style="min-height:400px;" white pa-4>
  <v-flex xs12 text-xs-center>
    <v-alert :value="message2" color="error" icon="warning" outline transition="scale-transition">
      {{this.message2}}
    </v-alert>
    <v-flex xs12>
      <v-text-field v-model="name" autofocus></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-text-field v-model="pw" autofocus></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-text-field v-model="email" autofocus></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-text-field v-model="classify" autofocus></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-text-field
        v-model="val"
         label="Password"
         loading
       >
         <template v-slot:progress>
           <v-progress-linear
             v-if="custom"
             :value="progress"
             :color="color"
             absolute
             height="3"
           ></v-progress-linear>
         </template>
       </v-text-field>

     </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="one" v-on:click="LogIn">Login</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="two"  v-on:click="loginWithGoogle">loginWithGoogle</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="three"  v-on:click="loginWithFacebook">loginWithFacebook</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="four"  v-on:click="Register">Register</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="one"  v-on:click="deleteuser">delete</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="two"  v-on:click="getUserData">getUserData</v-btn>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="three"  v-on:click="test3">test</v-btn>
    </v-flex>
  </v-flex>
</v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import firebase, {
  functions
} from "firebase/app";
import store from '../store'

export default {

  data: () => ({
    name: "헤헿",
    email: "admin@12.com",
    classify: "방문자",
    pw: "123123",
    message2:"",
    val:'',
    custom:true,
  }),
  store,

  computed: {
    progress () {
      return Math.min(100, this.val.length * 100/6)
    },
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 50)]
    },
  },
  methods: {
    async test() {
      const result = await FirebaseService.getUserData();
      console.log(result);
      this.name = result.name;
      this.email = result.email;
      this.classify = result.classify;
      //await FirebaseService.userDataToDB(this.email, this.classify, "");
    },
    test2() {
      console.log(this.$store.state.user.displayName);
    },
    test3(){
      console.log(this.progress, this.color);
    },



    login() {
      return firebase.auth()
        .signInWithEmailAndPassword(this.email, this.pw)
        .then(
          function(user) {
            return user
          },
          (err) => {
            if(err.message ==="There is no user record corresponding to this identifier. The user may have been deleted."){
              this.message = "존재하지 않는 아이디입니다."
            }else if(err.message ==="The password is invalid or the user does not have a password."){
              this.message = "비밀번호를 확인해주세요."
            }else if(err.message ==="The email address is badly formatted."){
              this.message = "잘못된 이메일 형식입니다."
            }
          }
        );
    },

    async LogIn() {
      let result =  await this.login();
      console.log("무엇이냐",result);
      this.$store.state.user = result.user;
      await this.userDataUpload();

      result = await FirebaseService.getUserData();
       console.log("로그인 절차 완료",this.$store.getters.USERINFO);
    },


    register() {
      return firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.pw)
        .then(
          function(user) {
            return "1 회원가입 완료했음";
          },
          (err) => {
            if(err.message === "The email address is already in use by another account."){
              this.message2 = "이미 존재하는 아이디 입니다."
            }else if(err.message ==="The email address is badly formatted."){
              this.message2 = "잘못된 이메일 형식입니다."
            }
          }
        );
    },

    async Register() {
      const result = await this.register();
      await this.userDataUpload();
      location.reload();
    },

    async loginWithGoogle() {
      const result = await FirebaseService.loginWithGoogle();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      await this.userDataUpload();
      this.$router.push({
        name: "home"
      });
    },

    async loginWithFacebook() {
      const result = await FirebaseService.loginWithFacebook();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      await this.userDataUpload();
      this.$router.push({
        name: "home"
      });
    },

    async userDataUpload(){
      let result = await FirebaseService.getUserData();
      if(result === undefined){
        const init = await FirebaseService.userDataInit();
        var name = this.$store.state.user.displayName;
        if(name == null){
          name = this.name;
        }
        const re = await FirebaseService.userDataToDB(this.$store.state.user.email,"방문자",name,firebase.firestore.FieldValue.serverTimestamp(),"https://i.imgur.com/OpxiyFt.png");
      }else{
        if(result.userImageUrl === undefined || result.userImageUrl == "" || result.userImageUrl=="https://i.imgur.com/OpxiyFt.png"){
          const re = await FirebaseService.userDataToDB(result.email,result.classify,result.name,result.created_at,"https://i.imgur.com/OpxiyFt.png");
        }
        else{
          const re = await FirebaseService.userDataToDB(result.email,result.classify,result.name,result.created_at,result.userImageUrl);
        }
      }
    },

    async getUserData(){
      const result = await FirebaseService.getUserData();
      console.log("userData",result);
      console.log("store.getters",this.$store.getters.USERINFO);
      console.log("store.getters",this.$store.state.user);
    },

    async deleteuser(){
      const result = await FirebaseService.selfDeleteUser();
      console.log(result);
    },

  }
}
</script>

<style>
.loginModal_btn {
  width: 120px;
  color: one;
}
</style>
