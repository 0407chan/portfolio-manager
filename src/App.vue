<style>
* {
    font-family: 'Nanum Gothic', sans-serif;
}
body, head{
  height: 100%;
  width: 100%;
}
::-webkit-scrollbar{width: 16px;}
::-webkit-scrollbar-track {background-color:#FCFFFC;}
::-webkit-scrollbar-thumb {background-color:#FCFFFC;}
::-webkit-scrollbar-thumb:hover {background: #555;}
::-webkit-scrollbar-button:start:decrement,::-webkit-scrollbar-button:end:increment {
width:16px;height:16px;background:#FCFFFC;}

#headMargin{
  margin-top: 50px;


}
</style>

<template>
  <v-app>
    <v-content>
      <div id = "header">
        <mainHeader/>
      </div>
    </v-content>

    <v-content>
      <buttonTop/>
      <buttonWrite/>
      <router-view/>
    </v-content>

    <mainFooter/>

  </v-app>
</template>


<script>
import store from './store'
import mainHeader from './components/Header.vue'
import mainFooter from './components/Footer.vue'
import buttonTop from './components/ButtonTop.vue'
import buttonWrite from './components/ButtonWrite.vue'
import * as easings from 'vuetify/es5/util/easing-patterns'

export default {
	name: 'App',
  components: {'mainHeader':mainHeader,
  'mainFooter':mainFooter,
  'buttonWrite':buttonWrite,
  'buttonTop':buttonTop
  },
	store,


}
</script>
<style>
.top_btn{
  margin-right: 5px;
  margin-bottom: 20px;
}
</style>
