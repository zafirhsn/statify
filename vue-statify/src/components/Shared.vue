<template>
  <v-container>
    <!-- Navbar Here -->
    <!-- Conditionally render button if user is not logged in -->
    <v-app-bar fixed elevate-on-scroll height="80" color="white">
      <v-spacer></v-spacer>
      <v-btn rounded color="#1DB954" class="white--text"><img src="../assets//Spotify_Icon_RGB_White.png">Connect to Spotify</v-btn>
    </v-app-bar>

    <v-row class="mt-12">
      <v-col class="mt-12" align="center">
        <!-- Profile Picture Here --> 
        <img class="welcome-image" :src="profile_image">
      </v-col>
    </v-row>

    <v-row>
      <v-col align="center">
        <!-- Welcome message -->
        <span class="display-3 font-weight-thin">{{display_name}}</span>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col align="center">
        <v-row class="mb-5">
          <v-col>
            <h1 class="display-1">At a Glance <span v-if="compareData">for You</span></h1>
          </v-col>
        </v-row>
        <v-row>
          <top-item :images="listening_data.artists[0].items[0].images" type="artist" :name="listening_data.artists[0].items[0].name"
          ></top-item>
          <top-item :images="listening_data.tracks[0].items[0].images" type="track" :name="listening_data.tracks[0].items[0].name"></top-item>
          <top-item type="genre" :name="topGenre"></top-item>
        </v-row>
      </v-col>

    </v-row> -->
    <v-divider class="mb-3"></v-divider>

    <top-lists v-if="dataArrived" :listening_data="listening_data" :compareData="compareData" listType="artists"></top-lists>

    <v-divider class="mb-3"></v-divider>

    <top-lists :listening_data="listening_data" :compareData="compareData" listType="tracks"></top-lists>

  </v-container>
</template>

<script>
import helper from '../services/helper';
import api from '../services/api/api'
// import _TopItem from './_TopItem.vue';
import _TopLists from './_TopLists.vue'

  export default {
    data() {
      return {
        display_name: "",
        user_id: "",
        profile_image: "",
        listening_data: {
          artists: [],
          tracks: []
        },
        error: false,
        errMsg: "",
        dataArrived: false,
        compareData: false
      }
    },
    components: {
      // 'top-item': _TopItem
      'top-lists': _TopLists
    },
    methods: {

    },
    beforeCreate() {
      console.log("===SHARED===");
      helper.setState(this);
      helper.printState(this);

      console.log(typeof this.$route.params.id);
      this.$store.state.sharedUser = { id : this.$route.params.id };
      if (this.$store.state.loggedIn) {
        this.$router.push('/dashboard');
      }
    },
    created() {
      api.getUser(this.$store.state.sharedUser.id, this).then(res=> {
        console.log(res);
        this.display_name = res.body.profile.display_name;
        this.user_id = res.body.profile.id;
        this.profile_image = res.body.profile.images[0].url;
      
        for (let key of res.body.data) {
          res.body.data[key].forEach(item=> {
            if (key === "artists") {
              this.listening_data.artists.push(helper.decompressData(item));
            } else {
              this.listening_data.tracks.push(helper.decompressData(item));
            }
          
          })
        }
        console.log(this.listening_data);
        this.dataArrived
      }).catch(e=> {
        if (e && e.status === 401) {
          this.errMsg = "You do not have permission to view this data";
          this.error = true;
        } 
        else if (e && e.status === 404) {
          this.errMsg = "That user does not exist";
          this.error = true;
        }
      })
    }
  }
</script>

<style scoped lang="scss"> 
  img {
    height: 20px;
    width: auto;
    margin-right: 10px;
  }
  img.welcome-image {
    height: 150px;
    width: auto;
    border-radius: 5px;
  }


</style>