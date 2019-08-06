<template>
  <v-timeline align-top dense clipped>
    <v-timeline-item color="grey" medium>
      <template>
        <a> 이름 </a>
      </template>
      <v-layout justify-space-between>
        <v-flex xs8 style="background-color: #EDEDED; border-radius: 10px">
          John Leider placed this order on Online Store
        </v-flex>
        <v-flex xs2 text-xs-right>
          시간
        </v-flex>
        <v-flex xs2 text-xs-right>
          <v-icon v-if="true" @click="" size="17" class="mr-2 comment_btn" hover color="three">create</v-icon>
          <v-icon v-if="true" @click="" size="17" class="mr-2 comment_btn" hover color="two">delete</v-icon>
        </v-flex>
      </v-layout>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
	name: 'PortfolioReComment',
  props: {
    PortfolioCommentId: {
      type: String
    },
    comment: {
      type: String
    },
    limit_Comment: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      username: '',
      useremail: '',
      portfolioId: '',
      user: '',
      portfolioComments: [],
      users: [],
      colors: ['two', 'three', 'four', 'five'],
      newComment: '',
      comment_input: '',
    }
  },
  created() {
    
  },
  methods: {

  },

}
</script>
