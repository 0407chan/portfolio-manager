<template>
        <v-card
                class="mx-auto"
                :flat="flat"
                :loading="loading"
                :outlined="outlined"
                :elevation="elevation"
                :width="width"
                :height="height"
                v-if="isAdmin===false"
        >
            <v-img
                    v-if="media"
                    class="white--text"
                    height="200px"
                    src="https://i.imgur.com/Cerxrec.png"
            >
            </v-img>
            <v-card-title v-else>EEEAZY PORTFOLIO</v-card-title>

            <v-card-text>
                <v-flex xs12>
                    <v-text-field label="Admin Account*" v-model="adminAccount" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Password*" v-model="password" type="password" required></v-text-field>
                </v-flex>
            </v-card-text>
            <v-card-actions @click="checkAdmin">
                <v-flex text-xs-center>
                    <v-btn icon>
                        <v-icon>lock_open</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    <v-list v-else-if="isAdmin">
        <v-list-tile-title>User List</v-list-tile-title>
    </v-list>
</template>
<script>
    export default {
        data() {
            return {
                isAdmin: false,
                flat: false,
                media: true,
                loading: false,
                outlined: false,
                elevation: undefined,
                raised: false,
                width: 344,
                height: undefined,
                adminAccount: '',
                password: '',
            }
        },
        methods: {
            checkAdmin () {
                if (this.adminAccount === 'admin' && this.password === 'admin') {
                    this.isAdmin = true;
                    swal("Admin님 환영합니다.","","success")
                } else {
                    swal( "Oops" ,  "다시 한 번 확인해주세요" ,  "error" )
                }
            }

        },
    }
</script>
<style scoped>
    .v-input__slider {
        width: 100%;
    }
</style>