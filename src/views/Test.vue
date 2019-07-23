<template>
<v-layout row justify-center>

      <v-flex text-xs-center>
        <v-btn round color="transparent" class="loginModal_btn" v-on:click="test">test</v-btn>
      </v-flex>

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
  name: "test",
  data: () => ({
    email: "admin@nave.rcom",
    classify: "방문자",
  }),
  methods: {
    async test() {
      console.log(this.email, this.classify);
      await FirebaseService.test(this.email, this.classify);
    }
  },
};
</script>

<style>
.loginModal_btn{
  width: 120px;
  color: one;
}
</style>
