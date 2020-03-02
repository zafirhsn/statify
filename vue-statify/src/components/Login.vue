<template>   
  <v-container fluid>
    <v-row class="ma-5">
      <v-col align="center">
        <!-- TODO: Pick a better name -->
        <h1 class="display-4">Statify</h1>
        <p class="subtitle-1">Your music in numbers</p>
      </v-col>
    </v-row>

    <v-row class="ma-12" justify="center">
      <v-col align="center" justify="center" sm="4" md="3" xl="2" >   
        <!-- TODO: Dynamically change icon size -->
        <i class="fas fa-headphones fa-5x"></i>
        <p class="title mt-3">Visualize Your Music</p>
        <p>See your top artists, track, and genres over time</p>
      </v-col>
      <v-col align="center" justify="center" sm="4" md="3" xl="2">
        <i class="fas fa-user-friends fa-5x"></i>
        <p class="title mt-3">Share With Friends</p>
        <p>Swap links with friends to compare</p>
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
      console.log("===LOGIN===");
      console.log("Data cached: " , this.$store.state.dataCached);
      console.log("Logged In: ", this.$store.state.loggedIn);
      console.log("Token Expired: ", this.$store.state.tokenExpired);

      if (!this.$store.state.loggedIn && localStorage.getItem("token")) {
        console.log("The user is not logged in but an old token remains in localStorage: ", JSON.parse(localStorage.getItem("token")));
        localStorage.removeItem("token");
        sessionStorage.removeItem("data");
        this.$store.state.dataCached = false;
      }
      else if (this.$store.state.loggedIn) {
        console.log("The user is logged in: ", JSON.parse(localStorage.getItem("token")));
        this.$router.push("/dashboard");
      }
    },
    created() {
      console.log("====TESTING ENV VARS===")
      console.log(this.backendURL);
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

</style>