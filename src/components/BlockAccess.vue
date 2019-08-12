<template>
    <v-container text-xs-center my-5>
        <v-layout my-5>
            <v-flex text-xs-center my-5>
                <v-icon size="150">sentiment_very_dissatisfied</v-icon>
            </v-flex>
        </v-layout>
        <v-layout my-5>
            <v-flex>
                <div class="display-1" style="color:#919191">
                    죄송합니다. 현재 요청하신 페이지는 접근하실 수 없습니다.
                </div>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex>
                <v-btn round color="five" :to="{name:'home'}"><v-icon color="one">home</v-icon></v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>