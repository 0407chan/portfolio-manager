<template>
    <button @click="User">
        dpdpdpdpdpdpdp
    </button>
</template>

<script>
import * as firebase from "firebase";
import * as admin from "firebase-admin";

export default {
    data() {
        return {}
        },
    methods: {
        User () {
            var uid = firebase.auth().currentUser.uid;
            admin.auth().getUser(uid)
                .then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.
                    console.log('Successfully fetched user data:', userRecord.toJSON());
                })
                .catch(function(error) {
                    console.log('Error fetching user data:', error);
                });
        }
    }
}
</script>

<style>

</style>
