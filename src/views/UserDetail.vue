<template>
    <v-container>
        <v-layout>
            <v-flex>
                  <v-card
                        max-width="344"
                        class="mx-auto"
                    >
                        <v-card-title>{{user.name}}</v-card-title>
                        <v-card-text>{{user.classify}}</v-card-text>
                        <v-card-actions>
                        <v-btn text @click="userInfo">Click</v-btn>
                        </v-card-actions>
                    </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import { userInfo } from 'os';
import firebase from "firebase/app";


export default {
    data() {
        return {
            user:"",
        }

    },
    created() {
        this.email = this.$route.params.email;
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                var result = await FirebaseService.getUser();
        }
        })
    },
    methods: {
    
    },
}
</script>

<style>

</style>