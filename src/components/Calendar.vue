<template>
    <v-layout>
        <v-flex my-5>
        <v-sheet height="500" elevation="1">
            <v-calendar :value="today" color="five">
            <template v-slot:day="{ date }">
                <template v-for="(event, index) in eventsMap[date]">
                  <div v-if="index < limit_post">
                    <v-menu :key="event.title" v-model="event.open" full-width offset-x>
                        <template v-slot:activator="{ on }">
                          <div v-if="!event.time" v-ripple class="my-event" v-on="on" v-html="event.title" :class="event.color"></div>
                        </template>
                        <v-card color="one" width="350px" flat max-height="300px" overflow=scroll>
                        <v-toolbar :color="event.color" dark height="40px">
                            <v-layout>
                                <v-flex xs8>
                                    <v-toolbar-title v-html="event.title" style="margin-top:5%"></v-toolbar-title>
                                </v-flex>
                                <v-flex xs4 text-xs-right>
                                    <v-btn v-if="user&&user.email===event.postWriter" icon :to="{ name: 'modifypost', params: {id: event.id}}">
                                    <v-icon size="17">edit</v-icon>
                                    </v-btn>
                                    <v-btn v-if="user&&user.email===event.postWriter" icon @click="deletePost(event.id)">
                                    <v-icon size="17">fa-trash</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-toolbar>
                        <v-card-title primary-title class="one">
                            <vue-markdown>{{event.details}}</vue-markdown>
                        </v-card-title>
                        </v-card>
                    </v-menu>
                  </div>
                  <div v-else-if="index === limit_post">
                      <v-flex text-xs-center>
                    <v-btn fab icon flat @click="morePost(limit_post)" :class="event.color" color="one" style="height:15px; width:15px; background-color:#274555">
                      <v-icon size="10">keyboard_arrow_down</v-icon>
                    </v-btn>
                    </v-flex>
                    <!--
                    <v-menu full-width offset-x>
                      <template v-slot:activator="{ on }" @click="alert('asd')">
                        <div v-ripple class="my-event" v-on="off" v-html="'more...'" :class="event.color"></div>
                      </template>
                    </v-menu>
                  -->
                  </div>
                </template>
            </template>
            </v-calendar>
        </v-sheet>
        </v-flex>
    </v-layout>
    </template>
<style lang="stylus" scoped>
.my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    // background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
    }
</style>
<script>
    import FirebaseService from "@/services/FirebaseService";
    import Post from "@/components/Post";
    import firebase from "firebase/app"
    export default {
    props:{
      limit_post: {
        type: Number,
        default: 2,
      }
    },
    data: () => ({
        today: "",
        events: [],
        posts: [],
        id: '',
        user: '',
        postWriter: '',
    }),
    components: {
        Post
    },
    mounted() {
        this.getPosts(this.id);
    },
    computed: {
        // convert the list of events into a map of lists keyed by date
        eventsMap() {
        const map = {};
        this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
        return map;
        },
        gettoday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }
        this.today = yyyy + "-" + mm + "-" + dd;
        }
    },
    methods: {
        open(event) {
        alert(event.title);
        },
        async getPosts(id) {
        this.posts = await FirebaseService.getPosts(id);
        var colors = ['two', 'three', 'four','five']
        for (var i = 0; i <this.posts.length; i ++) {
            let idx = i % 4;
            let postWriter = this.posts[i].writer;
            let title = this.posts[i].title;
            let body = this.posts[i].body;
            let created_at = this.posts[i].created_at;
            let date = `${created_at.getFullYear()}-${('0' + (created_at.getMonth() + 1)).slice(-2)}-${('0' + created_at.getDate()).slice(-2)}`;
            let color = colors[idx];
            let id = this.posts[i].id;
            this.events.push({postWriter: postWriter, title:title,details:body, date: date, color:color, id:id, open:false})
            }
        },
        async deletePost(id){
            swal('삭제되었습니다.');
            await FirebaseService.deletePost(id);
            location.reload();
        },
        morePost(data){
          this.limit_post = data+2;
        }
    },
    created() {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                this.user = await FirebaseService.getUserData();
            }

        });
    }
    };
</script>
