<style>
* {
  font-family: 'Nanum Gothic', sans-serif;
}

body,
head {
  height: 100%;
  width: 100%;
}

::-webkit-scrollbar {
  width: 16px;
}

::-webkit-scrollbar-track {
  background-color: #FCFFFC;
}

::-webkit-scrollbar-thumb {
  background-color: #FCFFFC;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

::-webkit-scrollbar-button:start:decrement,
::-webkit-scrollbar-button:end:increment {
  width: 16px;
  height: 16px;
  background: #FCFFFC;
}

#headMargin {
  margin-top: 50px !important;
}

.notifications {
  display: block !important;
  position: fixed !important;
  z-index: 5000 !important;
  top: 48px !important;
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
  font-size: 17px !important;
  margin: 7px 0 !important;
}
.notification-content {
  font-weight: 300 !important;
  font-size: 16px !important;
}
.vue-notification-template {
  display: block !important;
  /*box-sizing: border-box !important;*/
  background: white !important;
  text-align: left !important;
}

.vue-notification {
  display: block !important;
  /*box-sizing: border-box !important;*/
  text-align: left !important;
  font-size: 20px !important;
  margin: 2px 0 !important;
  color: black !important;
  background: #44A4FC !important;
  border-left: 0px none !important;
}

.vue-notification.warn {
  background: #fdc23e !important;
  opacity: 0.8 !important;
}

.vue-notification.error {
  background: #ff7761 !important;
  opacity: 0.8 !important;
}

.vue-notification.success {
  background: #68CD86 !important;
  opacity: 0.8;
}

.vn-fade-enter-active,
.vn-fade-leave-active,
.vn-fade-move {
  transition: all 1s !important;
}

.vn-fade-enter,
.vn-fade-leave-to {
  opacity: 0.1 !important;
}
</style>

<template>
<v-app>
  <notifications group="foo" position="top left"></notifications>
  <v-content>
    <div id="header">
      <mainHeader />
    </div>
    <buttonTop />
    <buttonWrite />
    <router-view />
  </v-content>

  <mainFooter />

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
  components: {
    'mainHeader': mainHeader,
    'mainFooter': mainFooter,
    'buttonWrite': buttonWrite,
    'buttonTop': buttonTop
  },
  store,
  data() {
    return {
      isAdmin: false,
    }
  },
  created() {
    FirebaseService.alarmOnFirstVisit()
      .then(async token => {
        var result = await FirebaseService.getUserData();
        if (result.classify === '관리자') {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
        FirebaseService.addToCloudMessagingUserList(token, this.isAdmin, result.allowPush);
        // console.log(token, this.isAdmin, result.allowPush)
      });
    FirebaseService.onMessageResponse();
  }
}
</script>
<style>
.top_btn {
  margin-right: 5px;
  margin-bottom: 20px;
}
</style>
