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
       :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <!-- <template v-if="props.item.edit">
          <td><input v-model="props.item.name" style="text-align:center;"></input></td>
          <td >{{ props.item.email }}</td>
          <td><v-select
              v-model="props.item.classify"
                :items="classifies"
                :menu-props="{offsetY: true }"
              ></v-select></td>
          <td >{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
          <td >{{ props.item.current_at.getFullYear()}}.{{ props.item.current_at.getMonth()+1}}.{{ props.item.current_at.getDate()}}</td>
          <td> <v-btn fab flat small color ="three" v-on:click="modifyUser(props.item)"><v-icon size="17">radio_button_unchecked</v-icon></v-btn>
                <v-btn fab flat small color ="two" v-on:click="editOff(props.item)"><v-icon size="17">clear</v-icon></v-btn>
          </td>
        </template> -->
        <!-- <template v-else> -->
          <td > {{ props.item.name }}</td>
          <td >{{ props.item.email }}</td>
          <td><v-select
              v-model="props.item.classify"
                :items="classifies"
                :menu-props="{offsetY: true }"
              ></v-select></td>
          <td >{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
          <td >{{ props.item.current_at.getFullYear()}}.{{ props.item.current_at.getMonth()+1}}.{{ props.item.current_at.getDate()}}</td>
          <td> <v-btn fab flat small color ="three" v-on:click="modifyUser(props.item)"><v-icon size="17">create</v-icon></v-btn>
                <v-btn fab flat small color ="two" v-on:click="deleteUser(props.item)"><v-icon size="17">delete</v-icon></v-btn>
          </td>
        <!-- </template> -->
      </template>

      <template v-slot:no-data transition="scale-transition">
        <v-alert  v-if="alertinit" :value="searchList.length == 0" color="error" icon="warning" outline >
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
        edit: false,
        users:[],
        alertinit:false,
        pagination: {},
        selected: [],
        classifies:["팀원","수퍼맨","방문자","지스맨","지쓰구리"],
        searchList:[],
        headers: [
          { text: 'Name', sortable: false, value: 'name', align: 'center'},
          { text: 'Email', value: 'email',sortable: false, align: 'center'},
          { text: 'Classify', value: 'classify' ,sortable: false,align: 'center'},
          { text: 'Created_at', value: 'created_at' ,sortable: false, align: 'center'},
          { text: 'Current_at', value: 'current_at' ,sortable: false, align: 'center'},
          { text: 'Actions', value: 'btns' ,sortable: false, align: 'center'},
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
          this.users[i].edit = false;
          this.searchList.push(this.users[i]);
        }
        this.alertinit = true;
      },
      get(){
        console.log(this.selected);
      },
      delete(){
        console.log("temp");
      },
      editOn(item){
        item.edit = true;
        console.log(item);
        var temp = [];
        for(var i = 0; i< this.searchList.length; i++){
          temp.push(this.searchList[i]);
        }
        this.searchList = [];
        for(var i = 0; i< temp.length; i++){
          this.searchList.push(temp[i]);
        }
      },
      editOff(item){

        this.getUsers();
      },
      async modifyUser(user){
        await FirebaseService.modifyUser(user);
        swal("수정사항이 반영되었습니까");
        this.getUsers();
      },
      async deleteUser(user){
        await FirebaseService.deleteUserbyId(user.id);
        this.getUsers();
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
            var b = this.users[i].email.toLowerCase()
            var c = this.users[i].classify.toLowerCase()
            if(a.includes(search) || b.includes(search) || c.includes(search)){
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
