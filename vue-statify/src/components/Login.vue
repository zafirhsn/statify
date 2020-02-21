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
import querystring from 'querystring';

  export default {
    data() {
      return {

      }
    },
    methods: {
      authorizeUser() {
        let state = this.generateRandomString();
        let url  = "https://accounts.spotify.com/authorize?" + 
        querystring.stringify({
          client_id: "d4557495633b429a85292698a89e5978",
          response_type: "token",
          redirect_uri: "http://localhost:8080/dashboard",
          state: state,
          scope: "user-read-private user-read-email user-read-birthdate user-top-read user-library-read user-read-recently-played"
        });
        localStorage.setItem("state", state);
        window.location = url;
      },
      generateRandomString() {
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let length = 16;
        let state = "";
        for (let i = 0; i < length; i++) {
          state += letters[Math.floor(Math.random() * letters.length)];
        }
        return state;
      },
      tokenLessThanOneDay(tokenObj) {
        let day = 24;
        let expiration = Number(tokenObj.expires_in) * day;
        let now = Math.floor(new Date().getTime() / 1000);
        let time = tokenObj.time;
        return (now - time < expiration)
      }
    },
    beforeCreate() {
      console.log("===LOGIN===");
      // If a token exists in localStorage, check to see that it's less than a day old
      if (localStorage.getItem("token")) {
        let tokenObj = JSON.parse(localStorage.getItem("token"));
        console.log("localStorage['token'] exists:", tokenObj);

        // If it is less than a day old, push dashboard
        if (this.tokenLessThanOneDay(tokenObj)) {
          console.log("The token is less than one day old, push dashboard")
          this.$router.push("/dashboard");
        } else {
        // Otherwise, token is too old, delete storage
          console.log("token is more than a day old, delete");
          localStorage.removeItem("token");
        }
      } else {
        console.log("Localstorage is empty");
      }
    },
    created() {

    }
  }
  

</script>

<style>

</style>