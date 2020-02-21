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
    <input ref="shareInput" type="text" :value="shareable_link" v-show="clicked">

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
      token_expired: false,
      user_id: "",
      shareable_link: "",
    }
  },
  methods: {
    share() {
      this.clicked = true;
      console.log(this.$refs);
      this.$refs.shareInput.focus();
      this.$refs.shareInput.select();
      // document.execCommand("copy");
      navigator.clipboard.writeText(this.shareable_link).then(()=> {
        console.log("copying succesfull");
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
    },
    getUserData() {
      // Requesting all top artists on spotify
      console.log("Requesting all top artists on spotify");
      let access_token = JSON.stringify(JSON.parse(localStorage.getItem("token")).access_token);
      access_token = access_token.slice(1, access_token.length-1);
      let options = {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      };
      console.log(access_token);
      Promise.all([this.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50", options), this.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", options), this.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", options)]).then(responses=> {
        console.log(responses);
      })
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

    // If, somehow, there is no valid params in url and localStorage is empty, we must prompt the user to authorize access to their information
    else if (!localStorage.getItem("token")) {
      this.authorizeUser();
    }


    console.log("localStorage: ", JSON.parse(localStorage.getItem("token")));
    let access_token = JSON.stringify(JSON.parse(localStorage.getItem("token")).access_token);
    access_token = access_token.slice(1, access_token.length - 1);
    console.log("access token: ", access_token);


    // Request current user's profile
    this.$http.get("https://api.spotify.com/v1/me", {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
    }).then((res)=> {
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
      this.user_id = res.body.id;
      this.shareable_link = `http://localhost:8080/user/${this.user_id}`
      sessionStorage.setItem("profile", JSON.stringify(filteredData));


      // Check database for user's data
      this.$http.get(`http://localhost:3000/getuser/${this.user_id}`).then((res)=>{
        console.log(res.status);
      }).catch(err=> {
        // If their data doesn't exist on db, request from spotify
        if (err.status === 404) {
          this.getUserData();
        }
      })

      // Store this user's profile in the database
      this.$http.post("http://localhost:3000/storeuser", filteredData).then((response)=> {
        console.log("User's profile stored successfully in db")
        console.log(response);
      }).catch(err=> {
        console.log(err.status);
      })


    }).catch(err=> {
      // If the token sent with the request to user's profile is expired, remove all localStorage and sessionStorage associated with the token and request new token
      if (err && err.status === 401) {
        this.token_expired = true;
        localStorage.removeItem("state");
        localStorage.removeItem("token");
        sessionStorage.removeItem("profile");
      }
    })

    // Query database for user data, if it doesn't exist, request data from spotify api

  }
}
</script>

<style scoped>

</style>