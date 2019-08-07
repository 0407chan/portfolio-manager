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

 .notifications {
   display: block !important;
   position: fixed !important;
   z-index: 5000 !important;
 }

.notification-wrapper {
  display: block !important;
  overflow: hidden !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.notification-title {
  font-weight: 600 !important;
}

.vue-notification-template {
  display: block !important;
  box-sizing: border-box !important;
  background: white !important;
  text-align: center !important;
}

.vue-notification {
  display: block !important;
  box-sizing: border-box !important;
  text-align: left !important;
  font-size: 15px !important;
  padding: 10px !important;
  margin: 0 5px !important;

  color: black !important;
  background: #44A4FC !important;
  border: 2px solid #187FE7 !important;
}

.vue-notification.warn {
  background: #FCFFFC !important;
  border-color: #fdc23e !important;
}

.vue-notification.error {
  background: #FCFFFC !important;
  border-color: #ff7761 !important;
}

.vue-notification.success {
  background: #68CD86 !important;
  border-left-color: #42A85F !important;
  opacity: 0.8;
}

.vn-fade-enter-active, .vn-fade-leave-active, .vn-fade-move  {
  transition: all 1s !important;
}

.vn-fade-enter, .vn-fade-leave-to {
  opacity: 0.1 !important;
}

</style>

<template>
  <v-app>
    <notifications group="foo" position="top center"/>
    <v-content>
      <div id = "header">
        <mainHeader/>
      </div>
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
import FirebaseService from './services/FirebaseService'

export default {
	name: 'App',
  components: {'mainHeader':mainHeader,
  'mainFooter':mainFooter,
  'buttonWrite':buttonWrite,
  'buttonTop':buttonTop
  },
  store,
  created() {
            FirebaseService.alarmOnFirstVisit()
                .then(token=>{
                    FirebaseService.addToCloudMessagingUserList(token);
                    // console.log(token)
                });
            FirebaseService.onMessageResponse();
        }
}
</script>
<style>
.top_btn{
  margin-right: 5px;
  margin-bottom: 20px;
}
</style>
