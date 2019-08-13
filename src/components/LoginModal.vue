<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <v-list-tile-title flat v-on="on" style="cursor: pointer">login</v-list-tile-title>
    </template>
    <v-tabs fixed-tabs internal-activator v-if="loginpw">
      <v-tab @click="resetSignin" internal-activator>Sign in</v-tab>
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
              <v-progress-circular v-if="!message && progressCheck" indeterminate color="four"></v-progress-circular>
              <v-alert :value="message" color="error" icon="warning" outline transition="scale-transition">
                {{this.message}}
              </v-alert>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-text-field label="Email*" :rules="[rules.required]" v-model="email" autofocus @keyup.esc="dialog=false" @keyup.self="message=''" @keyup.enter="SignIn"></v-text-field>
            </v-flex>
            <v-flex xs12 text-xs-center>

              <!-- <v-text-field label="Password*" type="password" v-model="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message=''" @keyup.enter="SignIn"></v-text-field> -->
              <v-text-field v-model="password" label="Password*" type="password" loading :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message=''" @keyup.enter="SignIn">
                <template v-slot:progress>
                  <v-progress-linear v-if="custom" :value="progress" :color="color" absolute height="1"></v-progress-linear>
                </template>
              </v-text-field>


            </v-flex>
            <v-flex>
              <v-btn flat color="#919191" @click="loginpwch">비밀번호를 잊어버리셨습니까?</v-btn>
            </v-flex>
            <!--            <v-flex><v-btn flat color="#919191" @click="activateForgetPassword">비밀번호를 잊어버리셨습니까?</v-btn></v-flex>-->
            <v-flex>
              <template v-if="isLogin">
                <v-btn round color="four" class="loginModal_btn" v-on:click="SignIn">Log in</v-btn>
              </template>
              <template v-else>
                <v-btn round disabled class="loginModal_btn">Log in</v-btn>
              </template>


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
              <v-progress-circular v-if="!message2 && progressCheck" indeterminate color="four"></v-progress-circular>
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
              <!-- <v-text-field v-model="ps1" label="Password*" type="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field> -->
              <v-text-field v-model="ps1" label="Password*" type="password" loading :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register">
                <template v-slot:progress>
                  <v-progress-linear v-if="custom" :value="progressRegi1" :color="colorRegi1" absolute height="1"></v-progress-linear>
                </template>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <!-- <v-text-field v-model="ps2" label="Password confirmation*" type="password" :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register"></v-text-field> -->
              <v-text-field v-model="ps2" label="Password confirmation*" type="password" loading :rules="[rules.required]" @keyup.esc="dialog=false" @keyup.self="message2=''" @keyup.enter="Register">
                <template v-slot:progress>
                  <v-progress-linear v-if="custom" :value="progressRegi2" :color="colorRegi2" absolute height="1"></v-progress-linear>
                </template>
              </v-text-field>
            </v-flex>
            <v-flex text-xs-center>
              <template v-if="isRegister">
                <v-btn round color="four" class="loginModal_btn" v-on:click="Register">Register</v-btn>
              </template>
              <template v-else>
                <v-btn round disabled class="loginModal_btn">Register</v-btn>
              </template>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs>
    <v-tabs fixed-tabs internal-activator v-else>
      <v-tab @click="resetFindPassword">Find Password</v-tab>
      <v-flex text-xs-right>
        <v-btn icon @click="closeDialog">
          <v-icon>highlight_off</v-icon>
        </v-btn>
      </v-flex>
      <v-tab-item>
        <v-layout align-center justify-center row fill-height elevation-5 style="min-height:400px;" white pa-4>
          <v-flex xs12 text-xs-center>
            <v-flex xs12>
              <v-progress-circular v-if="!message3 && progressCheck" indeterminate color="four"></v-progress-circular>
              <v-alert :value="message3" color="error" icon="warning" outline transition="scale-transition">
                {{this.message3}}
              </v-alert>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-text-field label="Email*" v-model="resetPassword" autofocus @keyup.esc="dialog=false" @keyup.self="message3=''" @keyup.enter="FindPassword"></v-text-field>
            </v-flex>
            <v-flex>
              <template v-if="isFindPW">
                <v-btn round color="four" v-on:click="FindPassword">Find Password</v-btn>
              </template>
              <template v-else>
                <v-btn round disabled>Find Password</v-btn>
              </template>
            </v-flex>
            <v-flex>
              <v-btn flat color="#919191" @click="loginpwSwitch">로그인하러 가기</v-btn>
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
  width: 100px;
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
    progressCheck: false,

    // login Data
    email: "",
    password: "",

    // Register Data
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
    message2: "",
    message3:"",

    // FindPW Data
    resetPassword: "",

    forgetPassword: false,
    loginpw: true,

    custom: true,

    isLogin: false,
    isRegister: false,
    isFindPW: false,
  }),

  computed: {
    progress() {
      return Math.min(100, this.password.length * 100 / 6)
    },
    color() {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 50)]
    },
    progressRegi1() {
      return Math.min(100, this.ps1.length * 100 / 6)
    },
    colorRegi1() {
      return ['error', 'warning', 'success'][Math.floor(this.progressRegi1 / 50)]
    },
    progressRegi2() {
      return Math.min(100, this.ps2.length * 100 / 6)
    },
    colorRegi2() {
      return ['error', 'warning', 'success'][Math.floor(this.progressRegi2 / 50)]
    },
  },
  watch: {
    email() {
      this.loginInputCheck();
    },
    password() {
      this.loginInputCheck();
    },
    email2() {
      this.registerInputCheck();
    },
    ps2() {
      this.registerInputCheck();
    },
    ps1() {
      this.registerInputCheck();
    },
    name() {
      this.registerInputCheck();
    },
    resetPassword() {
      if (this.resetPassword.length == 0) {
        this.isFindPW = false;
      } else {
        this.isFindPW = true;
      }
    },

  },
  methods: {
    loginInputCheck() {
      if (this.email.length == 0 || this.password.length == 0) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    },
    registerInputCheck() {
      if (this.email2.length == 0 || this.ps1.length == 0 || this.ps2.length == 0 || this.name.length == 0) {
        this.isRegister = false;
      } else {
        this.isRegister = true;
      }
    },


    loginpwch() {
      this.loginpw = false;
    },
    loginpwSwitch() {
      this.loginpw = true;
    },
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
      this.$store.state.userInfo = [];
    },
    login() {
      this.$router.replace("home");
    },

    signIn() {
      this.progressCheck = true;
      if (this.password.length < 6) {
        this.message = "비밀번호는 6자리 이상이어야 합니다."
      } else {
        return firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            function(user) {
              return user;
            },
            (err) => {
              if (err.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
                this.message = "존재하지 않는 아이디입니다."
              } else if (err.message === "The password is invalid or the user does not have a password.") {
                this.message = "비밀번호를 확인해주세요."
              } else if (err.message === "The email address is badly formatted.") {
                this.message = "잘못된 이메일 형식입니다."
              }
              this.progressCheck = false
            }
          );
      };
      this.progressCheck = false;
    },

    async SignIn() {
      let login = await this.signIn();
      if (login) {
        this.userDataUpload();
      }
    },

    async userDataUpload() {
      let result = await FirebaseService.getUserData();
      if (result === undefined || result == "TypeError: Cannot set property 'id' of undefined") {
        const init = await FirebaseService.userDataInit();
        var name = this.$store.state.user.displayName;
        if (name == null) {
          name = this.name;
        }
        const re = await FirebaseService.userDataToDB(this.$store.state.user.email, "방문자", name, firebase.firestore.FieldValue.serverTimestamp(), "https://i.imgur.com/OpxiyFt.png");
      } else {
        if (result.userImageUrl === undefined || result.userImageUrl == "" || result.userImageUrl == "https://i.imgur.com/OpxiyFt.png") {
          const re = await FirebaseService.userDataToDB(result.email, result.classify, result.name, result.created_at, "https://i.imgur.com/OpxiyFt.png");
        } else {
          const re = await FirebaseService.userDataToDB(result.email, result.classify, result.name, result.created_at, result.userImageUrl);
        }
      }
    },

    async getUserData() {
      const result = await FirebaseService.getUserData();
    },

    async deleteuser() {
      const result = await FirebaseService.deleteUser();
    },

    register() {
      this.progressCheck = true;
      if (this.ps1.length < 6 || this.ps2.length < 6) {
        this.message2 = "비밀번호는 6자리 이상이어야 합니다."
      } else if (this.ps1 !== this.ps2) {
        this.message2 = "비밀번호가 일치하지 않습니다."
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(this.email2, this.ps1)
          .then(
            function(user) {
              return user;
            },
            (err) => {
              if (err.message === "The email address is already in use by another account.") {
                this.message2 = "이미 존재하는 아이디 입니다."
              } else if (err.message === "The email address is badly formatted.") {
                this.message2 = "잘못된 이메일 형식입니다."
              }
              this.progressCheck = false
            }
          );
      }
      this.progressCheck = false
    },

    async Register() {
      let res = await this.register();
      if (res) {
        this.registerUserDataUpload();
      }
    },

    async registerUserDataUpload() {
      const init = await FirebaseService.userDataInit();
      const re = await FirebaseService.userDataToDB(this.email2, "방문자", this.name, firebase.firestore.FieldValue.serverTimestamp(), "https://i.imgur.com/OpxiyFt.png");
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
    resetFindPassword() {
      this.resetPassword = ""
      this.message3="";
    },
    async FindPassword() {
      this.progressCheck = true;
      var auth = firebase.auth();
      // console.log(this.resetPassword);
      let result = await auth.sendPasswordResetEmail(this.resetPassword).then(function() {
        swal('입력하신 이메일로 메일이 전송되었습니다.')
      }).catch(function(error) {

        if(error.message == "The email address is badly formatted."){
          return "잘못된 이메일 형식입니다."
        }else if(error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
          return "존재하지 않는 이메일 입니다."
        }
        this.progressCheck = false;
      });
      this.message3 = result;
      this.progressCheck = false;
    },
    closeDialog() {
      this.resetSignin();
      this.resetSignup();
      this.resetFindPassword();
      this.loginpwSwitch();
      this.forgetPassword = false;
      this.dialog = false;
    },
  },

};
</script>

<style>
.loginModal_btn {
  width: 120px;
  color: one;
}
</style>
