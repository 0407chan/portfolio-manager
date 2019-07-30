
<template>
  <v-fab-transition>
    <v-btn
        fixed
        dark
        fab
        bottom
        right
        color="three"
        v-show="scrolled==true"
        @click="$vuetify.goTo(target, options)"
      >
      <v-icon>
          keyboard_arrow_up
      </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
  export default {
    data() {
  		return {
        type: 'number',
  			scrolled: false,
        number: 0,
        duration: 300,
        offset: 0,

        direction: 'top',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: true,
        bottom: true,
        left: false,
        transition: 'slide-y-reverse-transition'
  		}
  	},

    methods: {
      handleScroll () {
        this.scrolled = window.scrollY > 0;
      }
    },

    beforeMount () {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll);
    },

    computed: {
      activeFab () {
        switch (this.tabs) {
          case 'one': return { 'class': 'purple', icon: 'account_circle' }
          case 'two': return { 'class': 'red', icon: 'edit' }
          case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      },
      target () {
        const value = this[this.type]
        if (!isNaN(value)) return Number(value)
        else return value
      },
      options () {
        return {
          duration: this.duration,
          offset: this.offset,
        }
      },
    },

    watch: {
      top (val) {
        this.bottom = !val
      },
      right (val) {
        this.left = !val
      },
      bottom (val) {
        this.top = !val
      },
      left (val) {
        this.right = !val
      }
    }
  }
</script>

<style>
  /* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>
