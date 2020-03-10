<template>
  <v-container>
    <!-- Navbar Here -->
    <!-- Conditionally render button if user is not logged in -->
    <v-app-bar fixed elevate-on-scroll height="80" color="white">
      <v-spacer></v-spacer>
      <v-btn rounded color="#1DB954" class="white--text" @click="login()"><img src="../assets//Spotify_Icon_RGB_White.png">Connect to Spotify</v-btn>
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

    <v-row>
      <v-col align="center">

        <v-row class="mb-5">
          <v-col>
            <h2 class="display-1">At a Glance for {{display_name}}</h2>
          </v-col>
        </v-row>
        <v-row>  
          <top-item :images="listening_data.artists[2].items[0].images" type="artist" :name="listening_data.artists[2].items[0].name"
          ></top-item>

          <top-item :images="listening_data.tracks[2].items[0].images" type="track" :name="listening_data.tracks[2].items[0].name"></top-item>

          <top-item type="genre" :name="topGenre"></top-item>
        </v-row>
      </v-col>
    </v-row>


    <v-divider class="mb-3"></v-divider>


    <v-row>
      <v-col>


        <h2 align="start" class="display-1 mb-7">{{display_name}}'s Top Artists From           
          <span v-if="Number(artistTimeFrame)===0">the Last Month</span>
          <span v-if="Number(artistTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(artistTimeFrame)===2">All Time</span>
        </h2>

        <!-- List Radio Group for time frame -->
        <v-radio-group v-model="artistTimeFrame" row mandatory>
  
          <!-- TODO: Change hover color to be spotify green -->
          <v-radio label="Last Month" value="0" color="#1DB954"></v-radio>
          <v-radio label="Last 6 Months" value="1" color="#1DB954"></v-radio>
          <v-radio label="All Time" value="2" color="#1DB954"></v-radio>
        </v-radio-group>

        <top-lists :data="listening_data" listType="artists" :timeFrame="artistTimeFrame">
        </top-lists>
      </v-col>
    </v-row>

    <v-divider class="mb-3"></v-divider>

    <v-row>
      <v-col>
        <h2 align="start" class="display-1 mb-7">{{display_name}}'s Top Tracks From           
          <span v-if="Number(trackTimeFrame)===0">the Last Month</span>
          <span v-if="Number(trackTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(trackTimeFrame)===2">All Time</span>
        </h2>

        <v-radio-group v-model="trackTimeFrame" row mandatory>
  
          <!-- TODO: Change hover color to be spotify green -->
          <v-radio label="Last Month" value="0" color="#1DB954"></v-radio>
          <v-radio label="Last 6 Months" value="1" color="#1DB954"></v-radio>
          <v-radio label="All Time" value="2" color="#1DB954"></v-radio>
        </v-radio-group>

        <top-lists :data="listening_data" listType="tracks" :timeFrame="trackTimeFrame">
        </top-lists>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h2 :align="align" class="display-1 mb-7">{{display_name}}'s Top Genres from
          <span v-if="Number(genreTimeFrame)===0">the Last Month</span>
          <span v-if="Number(genreTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(genreTimeFrame)===2">All Time</span>
        </h2>

        <v-radio-group v-model="genreTimeFrame" row mandatory>
          <v-radio label="Last Month" value="0" color="#1DB954"></v-radio>
          <v-radio label="Last 6 Months" value="1" color="#1DB954"></v-radio>
          <v-radio label="All Time" value="2" color="#1DB954"></v-radio>
        </v-radio-group>
        
        <top-genres :data="listening_data.artists" :compareData="compareData" listType="genres" :timeFrame=genreTimeFrame>

        </top-genres>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
import helper from '../services/helper';
import api from '../services/api/api'
import _TopItem from './_TopItem.vue';
import _TopLists from './_TopLists.vue'
import _TopGenres from './_TopGenres.vue';

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
        compareData: false,
        artistTimeFrame: 0,
        trackTimeFrame: 0,
        genreTimeFrame: 0
      }
    },
    computed: {
      topGenre() {
      let topGenres = {};
        for (let genre of this.listening_data.artists[2].genres) {
          if (topGenres[genre]) {
            topGenres[genre]++;
          } else {
            topGenres[genre] = 1;
          }
        }
      let max = 0; 
      let maxKey = "";
      for (let key in topGenres) {
        if (topGenres[key] > max) {
          max = topGenres[key];
          maxKey = key;
        }
      }
      return maxKey;
      }
    },
    components: {
      'top-item': _TopItem,
      'top-lists': _TopLists,
      'top-genres': _TopGenres
    },
    methods: {
      authorizeUser() {
        let obj = helper.generateAuthorizationString();
        localStorage.setItem("state", obj.state);
        window.location = obj.url;
      },   
      login() {
        sessionStorage.setItem("sharedUser", this.$route.params.id);
        this.authorizeUser();
      }
    },
    beforeCreate() {
      //console.log("===SHARED===");
      helper.setState(this);
      helper.printState(this);

      // //console.log(typeof this.$route.params.id);
      this.$store.state.sharedUser = { id : this.$route.params.id };
      if (this.$store.state.loggedIn) {
        this.$router.push('/dashboard');
      }
    },
    created() {
      api.getUser(this.$store.state.sharedUser.id, this).then(res=> {
        // //console.log(res);
        this.display_name = res.body.profile.display_name;
        this.user_id = res.body.profile.id;
        this.profile_image = res.body.profile.images[0].url;

        for (let key in res.body.data) {
          res.body.data[key].forEach(item=> {
            if (key === "artists") {
              this.listening_data.artists.push(helper.decompressData(item));
            } else {
              this.listening_data.tracks.push(helper.decompressData(item));
            }
          
          })
        }
        //console.log(this.listening_data);
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

  h2 {
    text-decoration: underline;
  }


</style>