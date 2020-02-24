<template>   
  <div class="container" id="login">
    
    <div class="row">
      <div class="col home-title" align="center">
        <i class="fa fa-bar-chart" aria-hidden="true"></i>
        <p>Statify</p>
      </div>
    </div>

    <div class="row">
      <div class="col home-descrip" align="center">
        <p>This site uses Spotify's web API to give users a glance at their listening habits and statistics<br><br> 
        Connect your Spotify Account to</p>
      </div>
    </div>

    <div class="row">
      <div class="col home-list">	   
        <ul> 
        <li>Check out your top tracks and artists from the last 4 weeks, 6 months, or of all time</li>
        <li>Find out which of your songs are happier, easier to dance to, have more energy, are more instrumental or vocal and more</li>
        <li>Find the average popularity of the artists in your library and see how obscure your music tastes are</li>
        <li>Put in the name of a playlist you own
          <ul>
          <li>Danceabilty</li>
          <li>Valence</li>
          <li>Tempo</li>
          <li>And more...</li>	
          </ul>	
        </li>	
        </ul>
      </div>
    </div>
    
    <div class="row">
      <div class ="col" align="center">
        <br>
        <br>
        <button type="button" id="login-button" class="btn btn-success btn-lg" data-target="button" @click="authorizeUser()">Connect to Spotify</button>
        <br>
        <br>
        <br>	
      </div>
    </div>
  </div>

</template>


<script>
import helper from '../services/helper'

  export default {
    data() {
      return {
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
      helper.setInitialState(this);
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

    }
  }
  

</script>

<style>

</style>