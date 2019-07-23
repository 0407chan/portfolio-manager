<style>
#title2 {
   text-overflow: ellipsis;
   display: -webkit-box;
   line-height: 16px;
   max-height: 32px;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
}

#body2 {
   text-overflow: ellipsis;
   display: -webkit-box;
   line-height: 16px;
   max-height: 32px;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
}
</style>



<template>
  <div class="py-3">
    <v-card color="transparent" flat>
    <v-layout>

      <v-flex xs12 sm7>
        <h2 class="font-weight-regular" id ='title2'>{{repos.path_with_namespace}}<v-btn flat icon :href="repoURL" target="_blank"><v-icon>fa-github</v-icon></v-btn></h2>
        <p class="subheading mb-1 grey--text text--darken-1 font-weight-light" id='body2'>{{repos.namespace.name}}</p>
        
      </v-flex>

      <v-flex hidden-xs-only sm5>
        <v-sheet color="transparent">
        <v-sparkline
        :value="value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="width"
        :stroke-linecap="lineCap"
        :labels="labels"
        auto-draw
        :gradient-direction="gradientDirection"
      ></v-sparkline>
    </v-sheet>
      </v-flex>

    </v-layout>
    </v-card>
  </div>
</template>

<script>
import GitlabService from '@/services/GitlabService'

export default {
	name: 'Repository',
	props: {
		repos: {type: null}
	},
	data() {
		return {
			stats: {},
      width: 4,
     radius: 7,
     padding: 10,
     lineCap: 'round',
     gradient: ['#f72047', '#ffd200', '#1ea1e3'],
     value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     labels : ['1','2','3','4','5','6','7','8','9','10','11','12'],
     year : 0,
     repoURL : '',
     gradientDirection: 'left'
		}
	},
  mounted() {
    let d = new Date();
    this.year = d.getYear();
		this.drawStatGraph();
  },
	methods: {
		async drawStatGraph() {
			this.commits = await GitlabService.getCommits(this.repos.id, this.repos.token);
      this.repoURL = this.repos.web_url
      this.commits.data.forEach((commit) => {
      let date = new Date(commit.created_at)
      if(date.getYear() == this.year){
          this.value[(new Date(commit.created_at)).getMonth()] +=1;
        }
      })
      this.value = Array.from(this.value)

		}
	},
  watch : {
    repos : function(newRepos){
      this.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.drawStatGraph();
    }
  }
}
</script>
