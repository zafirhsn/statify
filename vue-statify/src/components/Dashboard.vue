<template>
  <div>
    <div class="row">
			<div class="col" id="welcome" align="center">
				<p>Welcome, {{display_name}}</p>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>
    <button type="button" @click="share()">Share</button>
    <input type="text" value="laksjdlaskjd" v-if="clicked">

    <button type="button" @click="authorizeUser()" v-if="token_expired">Refresh Data</button>
  </div>
</template>

<script>
import querystring from 'querystring';

export default {
  data() {
    return {
      display_name: "Zafir",
      clicked: false,
      token_expired: false
    }
  },
  methods: {
    share() {
      this.clicked = true;
      this.$http.post("http://localhost:3000/").then((res)=>{
        console.log(res);
      })
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
    }
  }
  /* eslint-enable */,
  beforeCreate() {
    console.log("===DASHBOARD===")
  },
  created() {
    let hashObj = this.getHashParams();
    let numargs = 4;

    // If the hash object has 4 keys and the state value === the state in localStorage
    if (Object.keys(hashObj).length === numargs && hashObj.hasOwnProperty("access_token") && hashObj.hasOwnProperty("token_type") && hashObj.hasOwnProperty("expires_in") && hashObj.hasOwnProperty("state") && hashObj["state"] === localStorage.getItem("state")) {
      console.log("Valid hash in url");
      // If localStorage does not have a key "token", that means our login component either wiped the old key or this is the very first time a user is using this app, 
      if (!localStorage.getItem("token")) {
        console.log("Localstorage empty")
        // Add a timestamp to the token object so we can check its validatity at a later time
        hashObj["time"] = Math.floor(((new Date()).getTime()) / 1000);
        localStorage.setItem("token", JSON.stringify(hashObj));
      }
      // Otherwise, if the key exists, that means it was validated by our login component. The reason there are params in the url is because the user refreshed the page. Therefore, we don't have to add a new timestamp
      else {
        console.log("localStorage isn't empty, we will not modify it", Math.floor(new Date().getTime() / 1000));
      }
    }

    console.log("localStorage: ", JSON.parse(localStorage.getItem("token")));

    let access_token = JSON.stringify(JSON.parse(localStorage.getItem("token")).access_token);
    access_token = access_token.slice(1, access_token.length - 1);
    console.log("access token: ", access_token);

    if (!sessionStorage.getItem("profile")) {
      this.$http.get("https://api.spotify.com/v1/me", {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    }).then((res)=> {
      if (res.status === 401) {
        this.token_expired = true;
      }
      console.log("Get Current User's Profile Success: ", res);
      let display_name = res.body.display_name;
      let email = res.body.email;
      let id = res.body.id;
      let images = res.body.images;
      let filteredData = {
        display_name,
        email, 
        id, 
        images,
        share: false
      };
      sessionStorage.setItem("profile", JSON.stringify(filteredData));
      this.$http.post("http://localhost:3000/storeuser", filteredData).then((response)=> {
        console.log("Database op done")
        console.log(response);
      })
    }).catch(err=> {
      if (err && err.status === 401) {
        this.token_expired = true;
        localStorage.removeItem("state");
        localStorage.removeItem("token");
        sessionStorage.removeItem("profile");
      }
    })
    } else {
      console.log("sessionStorage is not empty, so do not make request", JSON.parse(sessionStorage.getItem("profile")));
    }


  }
}
</script>

<style scoped>

</style>