<template>
    <v-container>
        <v-layout wrap>
            <v-flex xs2></v-flex>
            <v-flex xs3>
                <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="four"
                ></v-progress-circular>
                <v-img :src="imageUrl" width="300" height="300" v-if="imageUrl" />

                <v-text-field
                        label="Select Image"
                        @click="pickFile"
                        v-model="imageName"
                        prepend-icon="attach_file"
                        color="four"
                        v-if="user.email==pageuser.email"
                ></v-text-field>

                <input
                        type="file"
                        style="display: none"
                        ref="image"
                        accept="image/*"
                        @change="onFilePicked"
                />
            </v-flex>
            <v-flex xs2></v-flex>
            <v-flex xs3>
                <v-layout align-center>
                    <v-flex text-xs-5 fill-height mb0 pb0>
                        <p class="title" style="margin-bottom: 0px">이름: </p>
                    </v-flex>
                    <v-flex text-xs-5 md0 pb0>
                        <v-text-field v-model="pageuser.name" v-if="user&&user.email==pageuser.email">
                        </v-text-field>
                        <v-text-field v-model="pageuser.name" readonly v-else-if="user&&user.email!==pageuser.email">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout align-center>
                    <v-flex text-xs-5>
                        <p class="title" style="margin-bottom: 0px">이메일: </p>
                    </v-flex>
                    <v-flex text-xs-5>
                        <v-text-field v-model="pageuser.email" readonly @click="cannotModify" v-if="user&&user.email==pageuser.email">
                        </v-text-field>
                        <v-text-field v-model="pageuser.email" readonly v-else-if="user&&user.email!==pageuser.email">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout align-center>
                    <v-flex text-xs-5>
                        <p class="title" style="margin-bottom: 0px">등급: </p>
                    </v-flex>
                    <v-flex text-xs-5>
                        <v-text-field v-model="pageuser.classify" readonly @click="cannotModify" v-if="user&&user.email==pageuser.email">
                        </v-text-field>
                        <v-text-field v-model="pageuser.classify" readonly v-else-if="user&&user.email!==pageuser.email">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-flex>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-flex text-xs-center my5>
            <v-btn icon flat @click="modifyUserWithImage" color="five" v-if="user&&user.email==pageuser.email"><v-icon>create</v-icon></v-btn>
        </v-flex>
    </v-container>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import { userInfo } from 'os';
import firebase from "firebase/app";
import axios from "axios";



export default {
    data() {
        return {
            user:"",
            result:'',
            pageuser:'',
            imageName: "",
            imageUrl: "",
            imageFile: "",
            loading:false,
            path: "https://api.imgur.com/3/image",
            clientid: "aac995cb6f223ce",
            callback: "feedback",
            id: "",
        }

    },
    created() {
        this.id = this.$route.params.id;
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                this.user = user;
                this.result = await FirebaseService.getUsers();
                for (var i in this.result) {
                    if (this.result[i].id === this.id) {
                        this.pageuser = this.result[i]
                        this.imageUrl = this.pageuser.userImageUrl
                    }
                }
        }
        })
    },
    methods: {
        async modifyUserWithImage() {
            if (this.imageUrl === ''){
                this.imageUrl = this.pageuser.userImageUrl
            }
            await FirebaseService.modifyUserWithImage(this.pageuser, this.imageUrl)
            this.$store.state.user = this.pageuser
            swal("개인정보 수정이 완료되었습니다.")
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
        cannotModify() {
            swal('수정이 불가한 항목입니다.')
        }
    },
}
</script>

<style>

</style>