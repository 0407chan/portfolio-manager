<template>
  <v-layout column px-4>
    <v-tabs v-model="active" color="three" dark slider-color="white" style="opacity:0.8">
      <v-tab v-for="(item,i) in userRepositories" :key="i"  ripple>
        {{item.username}}
      </v-tab>
    </v-tabs>
    <v-flex v-for="i in repositories.length > limits ? limits : repositories.length">
      <v-divider v-if="i === 1"></v-divider>
      <Repository :repos="repositories[i - 1]"></Repository>
      <v-divider></v-divider>
    </v-flex>


    <v-flex xs12 text-xs-center round my-5 v-if="loadMore">
      <v-btn round v-if="repositories.length > limits" color="four" dark v-on:click="loadMoreRepository">
        <v-icon size="17" class="mr-2">fa-plus</v-icon>More
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import Repository from '@/components/Repository'
import GitlabService from '@/services/GitlabService'

export default {
	name: 'RepositoryList',
	props: {

		loadMore: {type: Boolean, default: true}
	},
	data() {
		return {
			repositories: [],
      userRepositories :[{username : 'All', token: '', repositories: []},
                  {username : 'ChrisRhee', token: 'hdPnazsArc3BbqXtp6Uz', repositories: []},
                  {username : 'zettank', token: 'CG78C2m-HeYfPJ51A-To', repositories: []},
                  {username : 'jisssh', token: '4hP7HyqmT9uniRYsix23', repositories: []}],
      active : null,
      limits: {type: Number, default: 4},
    }
	},
	components: {
		Repository
	},
	mounted() {
    for(let i = 1; i < this.userRepositories.length; i++){
      this.getGitlabRepos(this.userRepositories[i].username, i, this.userRepositories[i].token);
    }

	},
	methods: {
		async getGitlabRepos(userName,index, privateToken='') {
			const response = await GitlabService.getRepos(userName,privateToken)
			if(response.status !== 200) {
				return
			}

			response.data.forEach((oneData)=>{
        oneData.token = privateToken
        this.userRepositories[0].repositories.push(oneData)
        this.userRepositories[index].repositories.push(oneData)
      })
		},
    loadMoreRepository() {
      this.limits += 4;
      this.checkLoadMore();
    },
    checkLoadMore(){
      if(this.repositories.length <= this.limits){
        this.loadMore = false;
        this.limits = this.repositories.length;
      }else{
        this.loadMore =true;
      }
    }
	},
  watch: {
    active : function(val){

      this.repositories = this.userRepositories[parseInt(val)].repositories;
      this.limits = 4;
      if(this.repositories.length > this.limits){
        this.loadMore =true;
      }
    }
  }
}
</script>
