<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <v-list-tile-title flat v-on="on" style="cursor: pointer;">
          <v-icon>g_translate</v-icon>
      </v-list-tile-title>
    </template>
    <v-card>
      <v-tabs fixed-tabs>
          <v-tab>Translate Service</v-tab>
          <v-flex text-xs-right>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog=false">
              <v-icon>highlight_off</v-icon>
          </v-btn>
          </v-flex>
        <v-tab-item>
            <v-container elevation-5>
              <v-layout wrap>
                <v-flex xs12>
                    <v-textarea
            label="InputText"
            v-model="inputText"
            auto-grow
            outline
            autofocus=""
            @keyup.enter="translateText"
            @keyup.esc="dialog=false"
          ></v-textarea>
                </v-flex>
                <v-flex xs3>
            <v-select
             :items="languageKey"
             v-model="inputLanguage"
             label="InputLanguage"
             append-icon="arrow_drop_down"
           ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-select
            :items="languageKey"
              v-model="outputLanguage"
             label="OutputLanguage"
             append-icon="arrow_drop_down"
           ></v-select>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3 text-xs-right>
            <v-btn round color="#EEEEEE" class="translate_btn" @click="translateText">번역</v-btn>
          </v-flex>
          <v-flex xs3 text-xs-right>
            <v-btn round color="#EEEEEE" class="translate_btn" @click="reset">초기화</v-btn>
          </v-flex>
          <v-flex xs12>
              <v-textarea
      label="OutputText"
      v-model="outputText"
      auto-grow
      outline
      readonly
    ></v-textarea>
          </v-flex>
              </v-layout>
              <small>* 부정확한 번역에 대한 책임은 사용자에게 있습니다.</small>
            </v-container>

        </v-tab-item>
                </v-tabs>
        </v-card>
  </v-dialog>
</v-layout>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
import axios from 'axios';

export default {
    name: 'Translate',
	data: () => ({
    dialog: false,
    inputText: '',
    outputText: '',
    inputLanguage: '한글',
    outputLanguage: '영어',
    languageKey: ['한글', '영어', '일본어', '프랑스어'],
    languageValue: {'한글': 'ko', '영어': 'en', '일본어': 'ja', '프랑스어':'fr'},
  }),
	methods: {
      translateText(){
        const URL = "https://www.googleapis.com/language/translate/v2?key=";
        const APIKEY = "AIzaSyCjXxSBjehySxd_SuAyYcwNdI9QiiQlkuE";
        var data =  '&source=' + this.languageValue[this.inputLanguage] + '&target=' + this.languageValue[this.outputLanguage] + '&format=text&q=' + this.inputText;
        //var data =  '&source=ko&target=en&format=text&q=' + this.inputText;
        axios.post(URL + APIKEY + data)
        .then(response=>{
            this.outputText = response.data.data.translations[0].translatedText
            console.log('trans : ' + this.outputText);
      });
    },
    reset(){
      this.inputText = '';
      this.outputText = '';
    }
	}
}
</script>
<style>
.translate_btn{

}
</style>
