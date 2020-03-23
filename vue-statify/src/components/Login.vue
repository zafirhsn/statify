<template>   
  <v-container fluid>
    <v-row class="ma-5">
      <v-col align="center">
        <!-- // TODO: Pick a better name -->
        <h1 class="display-4 font-weight-thin">Statify</h1>
        <p class="subtitle-1">Your music in numbers</p>
      </v-col>
    </v-row>

    <v-row class="ma-12" justify="center">
      <v-col align="center" justify="center">   
        <v-card raised>
          <i class="fas fa-headphones fa-5x mt-10"></i>
          <v-card-title  style="justify-content: center;">
            <p class="title mt-3 font-weight-regular">Visualize Your Music</p>
          </v-card-title>
          <v-divider class="mt-n4 mb-5"></v-divider>
          <v-card-subtitle>
            <p>See your top artists, tracks, and genres over time</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col align="center" justify="center">
        <v-card raised>
          <i class="fas fa-user-friends fa-5x mt-10"></i>
          <v-card-title style="justify-content: center;">
            <p class="title mt-3 font-weight-regular">Share With Friends</p>
          </v-card-title>
          <v-divider class="mt-n4 mb-5"></v-divider>
          <v-card-subtitle>
            <p>Swap links with friends to compare</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-12">
      <v-col align="center">
        <v-btn color="#1DB954" class="white--text" x-large rounded @click="authorizeUser()"><img src="../assets//Spotify_Icon_RGB_White.png">Connect to Spotify</v-btn>
      </v-col>
    </v-row>
      
  </v-container>

</template>


<script>
import helper from '../services/helper'

  export default {
    data() {
      return {
        backendURL: process.env.VUE_APP_BACKEND_URL
      }
    },
    methods: {
      authorizeUser() {
        let obj = helper.generateAuthorizationString();
        localStorage.setItem("state", obj.state);
        window.location = obj.url;
      }   
    },
    beforeCreate() {
      helper.setState(this);
      //console.log("===LOGIN===");
      //console.log("Data cached: " , this.$store.state.dataCached);
      //console.log("Logged In: ", this.$store.state.loggedIn);
      //console.log("Token Expired: ", this.$store.state.tokenExpired);

      if (!this.$store.state.loggedIn && localStorage.getItem("user")) {
        //console.log("The user is not logged in but an old token remains in localStorage: ", JSON.parse(localStorage.getItem("user")));
        localStorage.removeItem("user");
        sessionStorage.removeItem("data");
        this.$store.state.dataCached = false;
      }
      else if (this.$store.state.loggedIn) {
        //console.log("The user is logged in: ", JSON.parse(localStorage.getItem("user")));
        this.$router.push("/dashboard");
      }
    },
    created() {
      //console.log("====TESTING ENV VARS===")
      //console.log(this.backendURL);
      //console.log(this.$store.state.sharedUser);
    }
  }
  

</script>

<style scoped>
  img {
    height: 30px;
    width: auto;
    margin-right: 10px;
  }

  .container {
    height: 100%;
      /*background-color: #000000;*/
    /*#5B00BA*/
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#5b00ba+0,c57e14+100 */
    background: #5b00ba;
    /* Old browsers */
    background: -moz-linear-gradient(45deg, #5b00ba 0%, #c57e14 90%);
    /* FF3.6-15 */
    background: -webkit-linear-gradient(45deg, #5b00ba 0%, #c57e14 90%);
    /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(45deg, #5b00ba 0%, #c57e14 90%);
    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#5b00ba", endColorstr="#c57e14",GradientType=1 );
    /* IE6-9 fallback on horizontal gradient */
    font-family: "Roboto", sans-serif;
    color: #fff;
  }

  .v-card__title {
    word-break: normal;
  }

  .col {
    min-width: 200px;
  }

</style>