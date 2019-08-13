<template>
<div>
  <v-layout>
    <v-flex xs12 text-xs-center>
    </v-flex>
  </v-layout>
  <v-layout>
    <v-divider></v-divider>
    <v-flex md2 sm4>
      <section class="location">
        <div class="location footer-opacity">{{city}}, {{country}}</div>
        <div class="weather__description footer-opacity">{{weatherDesc}}</div>
      </section>
    </v-flex>

    <v-flex md2 sm4>
      <section class="weather">
        <img class="weather__icon footer-opacity" :src='this.weatherIcon' :title='this.weatherDesc'>
      </section>
    </v-flex>

    <v-flex md2 sm4>
      <section class="temperature">
        <div class="temperature__value footer-opacity">{{curTempDisplay}}</div>
        <div class="temperature__right">
          <div class="temperature__scale">

            <span class="btn btn-deg footer-opacity" v-bind:class="{ weatherMode:displayMode }" @click="getTemp(0)" style="cursor:pointer">°C</span> |
            <span class="btn btn-deg footer-opacity" v-bind:class="{ weatherMode:!displayMode }" @click="getTemp(1)" style="cursor:pointer">°F</span>
            <!-- <span class="btn btn-deg footer-opacity" :class="{ 'btn-deactivate': displayMode }"  @click="getTemp(0)" style="cursor:pointer">°C</span> |
            <span class="btn btn-deg footer-opacity" :class="{ 'btn-deactivate': !displayMode }"  @click="getTemp(1)" style="cursor:pointer">°F</span> -->
          </div>
        </div>
      </section>
    </v-flex>

    <v-flex md6 hidden-sm-and-down>
      <section class="measurements">
        <div class="cloudiness" title="안개">
          <img class="Weather_Sub_Icon footer-opacity" src="../../public/svg/wi-cloud.svg"><span class="Sub_Weather_value" style="height:30px; margin-top: 20px">{{cloudiness}}%</span>
        </div>
        <div class="wind-speed" title="풍속">
          <img class="Weather_Sub_Icon footer-opacity" src="../../public/svg/wi-strong-wind.svg"><span class="Sub_Weather_value">{{windSpeed}}m/s</span>
        </div>
        <div class="humidity" title="습도">
          <img class="Weather_Sub_Icon footer-opacity" src="../../public/svg/wi-humidity.svg"><span class="Sub_Weather_value">{{humidity}}%</span>
        </div>
      </section>
    </v-flex>
  </v-layout>
</div>
</template>
<script>
var CELSIUS = 0,
  FAHRENHEIT = 1;
export default {
  name: "FooterWeather",
  data() {
    return {
      latitude: 0.0,
      longitude: 0.0,
      city: 'SEOUL',
      country: 'KR',
      curTemp: null,
      displayMode: false,
      dataObj: null,
      weatherMain: 'Fine',
      weatherDesc: 'Clear day',
      errorMsg: '',
      cloudiness: 0,
      windSpeed: 0,
      humidity: 0,
      weatherIcon: require('../../public/svg/wi-cloud.svg'),
    };
  },
  components: {

  },
  methods: {
    getTemp: function(option) {
      this.displayMode = option;
    },
    getLocation: function() {
      if (!navigator.geolocation) {
        this.errorMsg = "Geolocation is not supported by your browser";
        this.city = this.errorMsg;
        console.warn(this.errorMsg);
        return;
      }
      // console.log('Getting current position..');
      var options = {
        timeout: 60000
      };
      navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    },
    success: function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.latitude = parseFloat(this.latitude).toFixed(2);
      this.longitude = parseFloat(this.longitude).toFixed(2);

      this.getWeather();
    },
    error: function(err) {
      this.errorMsg = "Unable to retrieve your location";
      this.city = this.errorMsg;

      console.warn(`ERROR(${err.code}): ${err.message}`);
      console.warn(this.errorMsg);
      this.getWeatherOffline();
    },

    getWeather() {
      const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.latitude + '&lon=' + this.longitude + '&APPID=53c4a4fe7f928deabafec1cf80cf8e3a'
      this.$http.get(`${BASE_URL}`)
        .then((response) => {
          this.dataObj = response.data;
          this.curTemp = this.dataObj.main.temp;
          this.country = this.dataObj.sys.country;
          this.city = this.dataObj.name;
          this.weatherMain = this.dataObj.weather[0].main;
          this.weatherDesc = this.dataObj.weather[0].description;
          this.cloudiness = this.dataObj.clouds.all;
          this.windSpeed = this.dataObj.wind.speed;
          this.humidity = this.dataObj.main.humidity;
          this.weatherIcon = this.getWeatherIcon(this.dataObj.weather[0].id);
          //console.log(response)
        })
    },

    getWeatherOffline() {
      const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q=seoul&APPID=53c4a4fe7f928deabafec1cf80cf8e3a'
      this.$http.get(`${BASE_URL}`)
        .then((response) => {
          this.dataObj = response.data;
          this.curTemp = this.dataObj.main.temp;
          this.country = this.dataObj.sys.country;
          this.city = this.dataObj.name;
          this.weatherMain = this.dataObj.weather[0].main;
          this.weatherDesc = this.dataObj.weather[0].description;
          this.cloudiness = this.dataObj.clouds.all;
          this.windSpeed = this.dataObj.wind.speed;
          this.humidity = this.dataObj.main.humidity;
          this.weatherIcon = this.getWeatherIcon(this.dataObj.weather[0].id);
          //console.log(response)
        })
    },
    getWeatherIcon(id) {
        if (this.dataObj != null) {
          var weatherID = this.dataObj.weather[0].id;
          if (weatherID >= 200 && weatherID <= 232) {
            return require('../../public/svg/wi-thunderstorm.svg');
          } else if (weatherID >= 300 && weatherID <= 321) {
            return require('../../public/svg/wi-sprinkle.svg');
          } else if (weatherID >= 500 && weatherID <= 531) {
            return require('../../public/svg/wi-rain.svg');
          } else if (weatherID >= 600 && weatherID <= 622) {
            return require('../../public/svg/wi-snow.svg');
          } else if (weatherID >= 701 && weatherID <= 781) {
            return require('../../public/svg/wi-day-haze.svg');
          } else if (weatherID == 800) {
            return require('../../public/svg/wi-dust.svg');
          } else if (weatherID >= 801 && weatherID <= 804) {
            return require('../../public/svg/wi-cloud.svg');
          } else if (weatherID >= 900 && weatherID <= 962) {
            return require('../../public/svg/wi-cloudy.svg');
          }
        }
    }
  },
  mounted() {
    this.getLocation();
    // console.log('App ready!');
  },
  computed: {
    curTempDisplay: function() {
      if (this.curTemp != null) {
        if (this.displayMode == CELSIUS) {
          return (this.curTemp - 273.15).toFixed(1);
        } else {
          return (this.curTemp * 9 / 5 - 459.67).toFixed(1);
        }
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped>
.location {
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
}

.weather {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.location {
  text-transform: uppercase;
  font-weight: bold;
}

.weather__description {
  text-transform: lowercase;
  margin-left: 10%;
  margin-right: 10%;
  text-align: center;
}

.weather__description:first-letter {
  text-transform: uppercase;
}

.weather__icon {
  -webkit-filter: invert(1);
  filter: invert(1);
  width: 7em;
}

.Weather_Sub_Icon{
  opacity: 0.75;
  -webkit-filter: invert(1);
  filter: invert(1);
  width: 3em;
}

.temperature {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
}

.temperature__value {
  margin-right: 5px;
  font-size: 3em;
  color: rgba(255, 255, 255, 1);
}

.temperature__right {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.temperature__scale {
  padding-top: 5px;
  font-size: 1.5em;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}

.temperature__high {
  padding-top: 5px;
}

.temperature__high img {
  vertical-align: middle;
}

.temperature__low img {
  vertical-align: middle;
}

.measurements {
  width: 100%;
  padding-top: 15px;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.cloudiness img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}

.wind-speed img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}

.humidity img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}

.Sub_Weather_value{
  opacity: 0.75;
  vertical-align: middle;
  font-size: 2em;
}
.footer-opacity{
  opacity: 0.75;
}

.weatherMode{
  color: #707070;
}
</style>
