<template>
  <div>
    <div class="row">
			<div class="col" id="welcome" align="center">
				<p>Welcome, {{display_name}}</p>
			</div>
		</div>
		<div class="row">
			<div class="col">
        <p>{{shareable_link}}</p>
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>
    <button type="button" @click="share()">Share</button>
    <input ref="shareInput" type="text" :value="shareable_link" v-show="clicked">

    <button type="button" @click="authorizeUser()" v-if="token_expired">Refresh Data</button>
  </div>
</template>

<script>
// import querystring from 'querystring';
import api from '../services/api/api';
import helper from '../services/helper'

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
      this.shareable_link = "hello";
    },
    /* eslint-disable */
    authorizeUser() {
      let obj = helper.generateAuthorizationString();
      localStorage.setItem("state", obj.state);
      window.location = obj.url;
    }
  }
  /* eslint-enable */,
  beforeCreate() {
    console.log("===DASHBOARD===")
    console.log("Data cached: " , this.$store.state.dataCached);
    console.log("Logged In: ", this.$store.state.loggedIn);
    console.log("Token Expired: ", this.$store.state.tokenExpired);
    helper.setInitialState(this);

    const setState = async () => {
      if (!this.$store.state.loggedIn) {
        console.log("Not logged in: ", localStorage.getItem("token"));
        if (helper.validHashParams()) {
          console.log("Valid hash in URL");
          let hashObj = helper.getHashParams();
          let time = Math.floor(new Date().getTime() / 1000);
          hashObj["time"] = time;
          let access_token = JSON.stringify(hashObj.access_token);
          access_token = access_token.slice(1, access_token.length - 1);

          // Get profile data
          let profileData = await api.getCurrentUserProfile(access_token, this);
          if (profileData.status === 401) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("data");
            helper.setInitialState(this);
            this.$router.push("/");
          }
          else {
            hashObj["id"] = profileData.id;
          }
          // Get Listening Data
          let userData = await api.getUserData(access_token, this);
          if (userData) {
            let data = {
              profile: profileData,
              id: profileData.id,
              data: userData
            }
            api.saveUser(data, this);
            sessionStorage.setItem("data", JSON.stringify(userData));
            helper.setInitialState(this);
            console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")))
          }

          // Set localStorage
          localStorage.setItem("token", JSON.stringify(hashObj));
          helper.setInitialState(this);
          console.log("Logged in: ", JSON.parse(localStorage.getItem("token")));
          console.log(this.$store.state.loggedIn);
        }
        else { 
          this.$router.push("/");
        }
      }
      if (this.$store.state.loggedIn) {
        console.log("Logged In: ", JSON.parse(localStorage.getItem("token")));
        if (!this.$store.state.dataCached) {
          console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")));
          let id = JSON.parse(localStorage.getItem("token")).id;
          let userData = await api.queryUser(id, this);
          helper.printState(this);
          sessionStorage.setItem("data", JSON.stringify(userData.body));
          helper.setInitialState(this);
          console.log("Data wasn't cached, but we got it from db");
        }
      }
      helper.printState(this);


    }

    setState().then().catch(e=> {
      console.log(e);
    });

  },
  created() {
    
  }
}
</script>

<style scoped>

</style>