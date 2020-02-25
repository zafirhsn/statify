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
// import querystring from 'querystring';
import api from '../services/api/api';
import helper from '../services/helper'

export default {
  data() {
    return {
      display_name: "Zafir",
      clicked: false,
      token_expired: false,
      userId: "",
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
    authorizeUser() {
      let obj = helper.generateAuthorizationString();
      localStorage.setItem("state", obj.state);
      window.location = obj.url;
    }
  }
  /* eslint-enable */,
  beforeCreate() {
    // Set the state of the application based on browser cache
    console.log("===DASHBOARD===")
    helper.setInitialState(this);
    console.log("Data cached: " , this.$store.state.dataCached);
    console.log("Logged In: ", this.$store.state.loggedIn);
    console.log("Token Expired: ", this.$store.state.tokenExpired);


    const setState = async () => {
      if (!this.$store.state.loggedIn) {
        console.log("Not logged in: ", localStorage.getItem("token"));

        if (helper.validHashParams()) {
          console.log("Valid hash in URL");

          // Get the params from the url and store them in an object. Add a timestamp to the object and create the string access token as well
          let hashObj = helper.getHashParams();
          let time = Math.floor(new Date().getTime() / 1000);
          hashObj["time"] = time;
          let access_token = JSON.stringify(hashObj.access_token);
          access_token = access_token.slice(1, access_token.length - 1);

          // Get profile data and listening data
          let listeningData;
          let profileData;

          try {
            listeningData = await api.getUserListeningData(access_token, this);
            profileData = await api.getCurrentUserProfile(access_token, this);
          } catch (e) {
            if (e & e.status === 401) {
              localStorage.removeItem("token");
              sessionStorage.removeItem("data");
              helper.setInitialState(this);
              this.$router.push('/');
            } else {
              console.log(e);
            }
          }
          // Add id and display_name to hasObj that will be stored in localStorage
          hashObj["id"] = profileData.id;
          hashObj["display_name"] = profileData.display_name;

          let filteredListeningData = {
            profile: profileData,
            id: profileData.id,
            data: []
          }
          for (let item of listeningData) {
            filteredListeningData.data.push(helper.compressData(helper.cleanArtistData(item)));
          }

          try { 
            await api.saveUser(filteredListeningData, this);
            console.log("Successfully stored user's profile in database")
          } catch(e) {
            console.log("There was an error saving the user to the db");
            localStorage.removeItem("token");
            sessionStorage.removeItem("data");
            helper.setInitialState(this);
            this.$router.push('/');
          }

          // Cache the data in sessionStorage
          sessionStorage.setItem("data", JSON.stringify(filteredListeningData.data));
          helper.setInitialState(this);
          console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")))

          // Cache the token with profile info in localStorage
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
        console.log("Already Logged In: ", JSON.parse(localStorage.getItem("token")));
        if (Object.keys(this.$store.state.sharedUser).length) {
          if (this.$store.state.sharedUser.id === JSON.parse(localStorage.getItem("token")).id) {
            console.log("this is you man");
          } else {
            console.log("This is a diff user")

            try { 
              this.$store.state.sharedUser = await api.getUser(this.$store.state.sharedUser.id, this);

            } catch(e) {
              if (e) {
                if (e.status === 401) {
                  console.log("You do not have permission to view this");
                }
                if (e.status === 404) {
                  console.log("This user does not exist");
                }
              }
            }
          }
        }
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
    // let tokenObj = JSON.parse(localStorage.getItem('token'));
    // // this.display_name = userObj.profile
    // this.userId = tokenObj.id;
    // this.shareable_link = `http://localhost:8080/user/${this.userId}`;


    
  }
}
</script>

<style scoped>

</style>