<template>
<v-container>
  <v-card class="mx-auto" :flat="flat" :loading="loading" :outlined="outlined" :elevation="elevation" :width="width" :height="height" v-if="isAdmin===false">
    <v-img v-if="media" class="white--text" height="200px" src="https://i.imgur.com/Cerxrec.png">
    </v-img>
    <v-card-title v-else>EEEAZY PORTFOLIO</v-card-title>

    <v-card-text>
      <v-flex xs12>
        <v-text-field label="Admin Account*" v-model="adminAccount" required></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field label="Password*" v-model="password" type="password" required @keyup.enter="checkAdmin"></v-text-field>
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

  <v-layout mt-5 wrap text-xs-center v-else-if="isAdmin">
    <v-flex xs12 text-xs-center>
      <v-text-field label="Search" v-model="search"></v-text-field>
    </v-flex>
    <v-flex xs12 text-xs-center>
      <v-data-table :headers="headers" :items="searchList" class="elevation-1">
        <template v-slot:items="props">
          <td> {{ props.item.name }}</td>
          <td>{{ props.item.email }}</td>
          <template v-if="props.item.classify=='관리자'">
            <td >🔥{{ props.item.classify }}🔥</td>
          </template>
          <template v-else>
            <td>
              <v-select v-model="props.item.classify" :items="classifies" :menu-props="{offsetY: true }"></v-select>
            </td>
          </template>
          <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
          <td>{{ props.item.current_at.getFullYear()}}.{{ props.item.current_at.getMonth()+1}}.{{ props.item.current_at.getDate()}}</td>
          <td>
            <v-btn fab flat small color="three" v-on:click="modifyUser(props.item)">
              <v-icon size="17">create</v-icon>
            </v-btn>
            <!-- <v-btn fab flat small color ="two" v-on:click="deleteUser(props.item)"><v-icon size="17">delete</v-icon></v-btn> -->
          </td>
          <!-- </template> -->
        </template>

        <template v-slot:no-data transition="scale-transition">
          <v-alert v-if="alertinit" :value="searchList.length == 0" color="error" icon="warning" outline>
            "{{search}}" is not in Users
          </v-alert>
        </template>
      </v-data-table>
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
      selected: [],
      search: '',
      edit: false,
      users: [],
      alertinit: false,
      pagination: {},
      selected: [],
      classifies: ["팀원", "수퍼맨", "방문자", "지스맨", "지쓰구리"],
      searchList: [],
      headers: [
        { text: 'Name',sortable: false, value: 'name', align: 'center' },
        { text: 'Email', value: 'email', sortable: false, align: 'center' },
        { text: 'Classify', value: 'classify', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Current_at', value: 'current_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
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
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].edit = false;
        this.searchList.push(this.users[i]);
      }
      this.alertinit = true;
    },
    get() {
      console.log(this.selected);
    },
    delete() {
      console.log("temp");
    },
    editOn(item) {
      item.edit = true;
      console.log(item);
      var temp = [];
      for (var i = 0; i < this.searchList.length; i++) {
        temp.push(this.searchList[i]);
      }
      this.searchList = [];
      for (var i = 0; i < temp.length; i++) {
        this.searchList.push(temp[i]);
      }
    },
    editOff(item) {
      this.getUsers();
    },

    async modifyUser(user) {
      await FirebaseService.modifyUser(user);
      swal("수정사항이 반영되었습니다.");
      this.getUsers();
    },

    async deleteUser(user) {
      await FirebaseService.deleteUserbyId(user.id);
      this.getUsers();
    },

    checkAdmin() {
      if (this.adminAccount === 'admin' && this.password === 'admin') {
        this.isAdmin = true;
        swal("Admin님 환영합니다.", "", "success")
      } else {
        swal("Oops", "다시 한 번 확인해주세요", "error")
      }
    },

    highlight(text) {
      var inputText = document.getElementById("inputText");
      var innerHTML = inputText.innerHTML;
      var index = innerHTML.indexOf(text);
      if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
      }
    }
  },
  watch: {
    search() {
      if (this.search.length == 0) {
        var len = this.users.length;
        this.searchList = [];
        for (var i = 0; i < len; i++) {
          this.searchList.push(this.users[i]);
        }
      } else {
        this.searchList = [];
        var len = this.users.length;
        var search = this.search;
        search = search.toLowerCase();
        for (var i = 0; i < len; i++) {
          var a = this.users[i].name.toLowerCase()
          var b = this.users[i].email.toLowerCase()
          var c = this.users[i].classify.toLowerCase()
          if (a.includes(search) || b.includes(search) || c.includes(search)) {
            this.searchList.push(this.users[i]);
          }
        }
      }
    },
  },

}
</script>
