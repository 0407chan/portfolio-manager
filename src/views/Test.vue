<template>
<v-layout row justify-center>
  <v-flex xs12>
    <v-text-field v-model="name" autofocus></v-text-field>
  </v-flex>
  <v-flex xs12>
    <v-text-field v-model="email" autofocus></v-text-field>
  </v-flex>
  <v-flex xs12>
    <v-text-field v-model="classify" autofocus></v-text-field>
  </v-flex>
  <v-flex text-xs-center>
    <v-btn round color="transparent" class="loginModal_btn" v-on:click="test">test</v-btn>
  </v-flex>

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

  data: () => ({
    name: "헤헿",
    email: "admin@nave.rcom",
    classify: "방문자",
  }),

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
  }
}
</script>

<style>
.loginModal_btn {
  width: 120px;
  color: one;
}
</style>
