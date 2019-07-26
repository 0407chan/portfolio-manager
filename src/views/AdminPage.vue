<template>
  <v-container>
  <v-layout mt-5 wrap text-xs-center>
    <v-flex xs12 text-xs-center >
      <v-text-field label="Search" v-model="search"></v-text-field>
    </v-flex>
    <v-flex xs12 text-xs-center >
    <v-data-table
      :headers="headers"
      :items="searchList"
       hide-actions

      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td >{{ props.item.email }}</td>
        <td >{{ props.item.classify }}</td>
        <td >{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()+1}}</td>
        <td >{{ props.item.current_at.getFullYear()}}.{{ props.item.current_at.getMonth()+1}}.{{ props.item.current_at.getDate()+1}}</td>
      </template>

      <template v-slot:no-data transition="scale-transition">
        <v-alert :value="searchList.length == 0" color="error" icon="warning" outline >
          "{{search}}" is not in Users
        </v-alert>
      </template>
    </v-data-table>

    </v-flex>
    <v-flex xs12 text-xs-center pt-2>
      <v-pagination v-model="pagination.page" :length="pages" next-icon="keyboard_arrow_right"
      prev-icon="keyboard_arrow_left"></v-pagination>
    </v-flex>
    <v-flex text-xs-center>
      <v-btn round color="two"  v-on:click="get">getUsers</v-btn>
    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
import FirebaseService from "@/services/FirebaseService";
import firebase, {
  functions
} from "firebase/app";
  export default {
    data () {
      return {
        selected: [],
        search: '',
        users:[],
        pagination: {},
        selected: [],
        searchList:[],
        headers: [
          { text: 'Name', sortable: false, value: 'name', align: 'center'},
          { text: 'Email', value: 'email',sortable: false, align: 'center' },
          { text: 'Classify', value: 'classify' ,sortable: false, align: 'center'},
          { text: 'Created_at', value: 'created_at' ,sortable: false, align: 'center'},
          { text: 'Current_at', value: 'current_at' ,sortable: false, align: 'center'},
        ],
      }
    },
    mounted() {
      this.getUsers();
    },
    methods: {
      async getUsers() {
        this.users = await FirebaseService.getUsers();
        this.searchList = [];
        for(var i = 0; i< this.users.length; i++){
          this.searchList.push(this.users[i]);
        }
      },
      get(){
        console.log(this.selected);
      }
    },
    watch: {
      search() {
        if(this.search.length == 0){
          var len = this.users.length;
          this.searchList = [];
          for(var i = 0; i< len; i++){
            this.searchList.push(this.users[i]);
          }
        }else{
          this.searchList = [];
          var len = this.users.length;
          var search = this.search;
          search = search.toLowerCase();
          for(var i = 0; i< len; i++){
            var a = this.users[i].name.toLowerCase()
            if(a.includes(search)){
              this.searchList.push(this.users[i]);
            }
          }
        }
      },
    },

    computed: {
      pages () {
        if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return 0
        console.log(this.pagination.totalItems , this.pagination.rowsPerPage);
        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      },
    }
  }
</script>
