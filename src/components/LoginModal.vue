<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <v-list-tile-title flat v-on="on" style="cursor: pointer">login</v-list-tile-title>
    </template>
    <v-tabs fixed-tabs>
      <v-tab @click="resetSignin">Sign in</v-tab>
      <v-tab @click="resetSignup">Register</v-tab>
      <v-flex text-xs-right>
        <v-btn icon @click="closeDialog">
          <v-icon>highlight_off</v-icon>
        </v-btn>
      </v-flex>

      <!-- Login page 내용들 -->
      <v-tab-item>
        <v-layout align-center justify-center row fill-height elevation-5 style="min-height:400px;" white pa-4>
          <v-flex xs12 text-xs-center>
            <v-flex xs12>
              <v-progress-circular
                v-if="!message && progress"
                indeterminate
                color="four"
              ></v-progress-circular>
              <v-alert :value="message" color="error" icon="warning" outline transition="scale-transition">
                {{this.message}}
              </v-alert>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-text-field label="Email*" :rules="[rules.required]" v-model="email" autofocus @keyup.esc="dialog=false" @keyup.self="message=''" @keyup.enter="SignIn"></v-text-field>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-text-field label="Password*" type="password" v-model="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message=''" @keyup.enter="SignIn"></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn round color="transparent" class="loginModal_btn" v-on:click="SignIn">log in</v-btn>
              <v-btn round color="transparent" class="loginModal_btn" v-on:click="loginWithGoogle">
                <img src="../../public/img/google_logo.png" style="width:35px;height:25px;">
              </v-btn>
              <v-btn round color="transparent" class="loginModal_btn" v-on:click="loginWithFacebook">
                <img src="../../public/img/facebook_logo.png" style="width:35px;height:35px;">
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-tab-item>

      <!-- Register 내용들 -->
      <v-tab-item>
        <v-layout align-center justify-center row fill-height elevation-5 style="min-height:400px;" white pa-4>
          <v-flex xs12 text-xs-center>
            <v-flex xs12>
              <v-progress-circular
                v-if="!message2 && progress"
                indeterminate
                color="four"
              ></v-progress-circular>
              <v-alert :value="message2" color="error" icon="warning" outline transition="scale-transition">
                {{this.message2}}
              </v-alert>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Name*" :rules="[rules.required]" v-model="name" autofocus @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Email*" :rules="[rules.required]" v-model="email2" autofocus @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="ps1" label="Password*" type="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="ps2" label="Password confirmation*" type="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field>
            </v-flex>
            <v-flex text-xs-center>
              <v-btn round color="transparent" class="loginModal_btn" v-on:click="Register">Sign Up</v-btn>
            </v-flex>
          </v-flex>
        </v-layout>

      </v-tab-item>
    </v-tabs>
  </v-dialog>
</v-layout>
</template>

<style>
.loginModal_btn {
  width:100px;
}
</style>


<script>
import FirebaseService from "@/services/FirebaseService";
import firebase, {
  functions
} from "firebase/app";

export default {
  name: "LoginPage",
  data: () => ({
    dialog: false,
    progress:false,
    email: "",
    password: "",
    email2: "",
    ps1: "",
    name: "",
    ps2: "",
    title: "Preliminary report",
    rules: {
      required: value => !!value || "Required.",
      counter: value => value.length <= 20 || "Max 20 characters",
      min: v => v.length >= 6 || "Min 6 characters",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern || "Invalid e-mail.";
      }
    },
    message: "",
    message2: ""
  }),
  computed: {

  },
  components: {

  },
  methods: {
    async loginWithGoogle() {
      const result = await FirebaseService.loginWithGoogle();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      this.userDataUpload();
      this.$router.push({
        name: "home"
      });
    },
    async loginWithFacebook() {
      const result = await FirebaseService.loginWithFacebook();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      this.userDataUpload();
      this.$router.push({
        name: "home"
      });
    },
    signOut() {
      FirebaseService.logout().then(function() {
          // console.log("aa");
        }),
        firebase
        .auth()
        .signOut()
        .then(function() {

        });
        this.$store.state.userInfo=[];
    },
    login() {
      this.$router.replace("home");
    },

    signIn() {
      this.progress= true;
      if(this.email == ""){
        this.message = "이메일을 입력해주세요."
      }else if(this.password == ""){
        this.message = "비밀번호를 입력해주세요."
      }else if(this.password.length < 6){
        this.message = "비밀번호는 6자리 이상이어야 합니다."
      }else{
        return firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            function(user) {

            },
            (err) => {
              if(err.message ==="There is no user record corresponding to this identifier. The user may have been deleted."){
                this.message = "존재하지 않는 아이디입니다."
              }else if(err.message ==="The password is invalid or the user does not have a password."){
                this.message = "비밀번호를 확인해주세요."
              }else if(err.message ==="The email address is badly formatted."){
                this.message = "잘못된 이메일 형식입니다."
              }
              this.progress= false
            }
          );
        };
        this.progress= false;
    },

    async SignIn() {
      let login =  await this.signIn();
      this.userDataUpload();
    },

    async userDataUpload(){
      let result = await FirebaseService.getUserData();
      if(result === undefined){
        const init = await FirebaseService.userDataInit();
        var name = this.$store.state.user.displayName;
        if(name == null){
          name = this.name;
        }
        result = await FirebaseService.getUserData();
        const re = await FirebaseService.userDataToDB(this.$store.state.user.email,"방문자",name,firebase.firestore.FieldValue.serverTimestamp());
      }else{
        const re = await FirebaseService.userDataToDB(result.email,result.classify,result.name,result.created_at);
      }
    },

    async getUserData(){
      const result = await FirebaseService.getUserData();
    },

    async deleteuser(){
      const result = await FirebaseService.deleteUser();
    },

    register() {
      this.progress= true;
      if(this.name == ""){
        this.message2 = "이름을 입력해주세요."
      }else if (this.email2 == ""){
        this.message2 = "이메일을 입력해주세요."
      }else if(this.ps1 == "" || this.ps2 == ""){
        this.message2 = "비밀번호를 입력해주세요."
      }else if(this.ps1.length < 6 || this.ps2.length <6){
        this.message2 = "비밀번호는 6자리 이상이어야 합니다."
      }else if(this.ps1 !== this.ps2){
        this.message2 = "비밀번호가 일치하지 않습니다."
      }else{
        return firebase
          .auth()
          .createUserWithEmailAndPassword(this.email2, this.ps1)
          .then(
            function(user) {

            },
            (err) => {
              if(err.message === "The email address is already in use by another account."){
                this.message2 = "이미 존재하는 아이디 입니다."
              }else if(err.message ==="The email address is badly formatted."){
                this.message2 = "잘못된 이메일 형식입니다."
              }
              this.progress= false
            }
          );
      }
      this.progress= false
    },

    async Register() {
      let runRegister =  await this.register();
      this.userDataUpload();
    },


    resetSignin() {
      this.email = ""
      this.password = ""
      this.message = ""
    },
    resetSignup() {
      this.name = ""
      this.email2 = ""
      this.ps2 = ""
      this.message2 = ""
    },

    closeDialog(){
      this.resetSignin();
      this.resetSignup();
      this.dialog = false;
    }
  },
  mounted() {
    // console.log(this.$store.state);
  }
};
</script>

<style>
.loginModal_btn{
  width: 120px;
  color: one;
}
</style>
