<template>
    <v-container>
        <v-layout>
            <v-flex>
                    <v-card
                        max-width="344"
                        class="mx-auto"
                    >
                        <v-card-title>{{pageuser.name}}</v-card-title>
                        <v-card-text>{{pageuser.classify}}</v-card-text>
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
            result:'',
            pageuser:'',
        }

    },
    created() {
        this.id = this.$route.params.id;
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                this.result = await FirebaseService.getUsers();
                for (var i in this.result) {
                    if (this.result[i].id === this.id) {
                        this.pageuser = this.result[i]
                    }
                }
        }
        })
    },
    methods: {
    },
}
</script>

<style>

</style>