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
        let url  = "https://accounts.spotify.com/authorize?" + 
        querystring.stringify({
          client_id: "d4557495633b429a85292698a89e5978",
          response_type: "token",
          redirect_uri: "http://localhost:8080",
          scope: "user-read-private user-read-email user-read-birthdate user-top-read user-library-read user-read-recently-played"
        });
        window.location = url;
  

      },
      /* eslint-disable */
      getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
          hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
      }
    }
    /* eslint-enable */
    ,
    created() {
      console.log(this.getHashParams());
    }

  }

</script>

<style>

</style>