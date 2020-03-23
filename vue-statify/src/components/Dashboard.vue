<template>
    <v-container>

    <!-- // ^ APP BAR NAV-->
    <v-app-bar fixed elevate-on-scroll height="80" color="white">
      <v-spacer></v-spacer>

      <!-- // ^ MENU -->
      <v-menu :close-on-content-click=vuetify.closeOnContentClick offset-y transition="slide-y-transition">
        <!-- // TODO: Make menu open lower under avatar (offset-y is not enough). Vuetify is adding the position of the menu using an inline style tag. !important is not working as a internal class or inline style-->

        <!-- // Avatar is activator for menu -->
        <template v-slot:activator="{on}">
            <v-btn fab v-on="on">
              <v-avatar size="52">
                <v-img :src="profile_image"></v-img>
              </v-avatar>
            </v-btn>
        </template>
 

        <!-- // Menu is a card made up of lists -->
        <v-card>

          <!-- // First list is avatar with display name and sharing status -->
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="profile_image" alt="Profile picture">
              </v-list-item-avatar>   
              <v-list-item-content>
                <v-list-item-title>
                  {{display_name}}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Sharing <span v-if="sharing">On</span><span v-if="!sharing">Off</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- // Second list is sharing switch and logout button-->
          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch inset v-model="sharing" color="#1DB954" label=" Sharing" id="menuShareSwitch">
                  <!-- // TODO: Sharing label is too close to the switch -->
                </v-switch>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-btn block color="#1DB954" class="white--text" @click="logout()">Log Out</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>


        </v-card>


      </v-menu>
      
    </v-app-bar>

    <!-- // ^ PROFILE PIC-->
    <v-row class="mt-12">
      <v-col class="mt-12" align="center">

        <v-fade-transition>
          <v-skeleton-loader tile height="150" width="150" type="image" v-if="!dataArrived">
        </v-skeleton-loader>

        <img v-else class="welcome-image" :src="profile_image">
      </v-fade-transition>
      </v-col>
      <v-col  class="mt-12" align="center" v-if="compareData">
        <img class="welcome-image" :src="sharedUser.profile.images[0].url" v-if="compareData">
      </v-col>
    </v-row>

    <!-- // ^ DISPLAY NAME -->
    <v-row>
      <v-col align="center">
        <span class="display-3 font-weight-thin">{{display_name}}</span>
        
        <span class="display-3 font-weight-thin" v-if="compareData" style="display: inline;">
          <span class="display-1 font-weight-light"> and</span> {{sharedUser.profile.display_name}} 
        </span>
      </v-col>
    </v-row>

    <!-- // ^ SHARE-LINK COMPONENT -->
    <share-link :shareable_link="shareable_link" :sharing="sharing" :compareData="compareData" :sharedUserExists="sharedUserExists" @updateCompare="compareData = $event" @updateSharing="sharing = $event"></share-link>

    <!-- // <v-divider class="mb-3"></v-divider> -->

    <!-- // ! FEATURE TO GENERATE SHARED PLAYLIST -->
    <v-row v-if="compareData">
      <v-col>
        <!-- // TODO: Conditionally render generate playlist button --> 
      </v-col>
    </v-row>

    <!-- // ^ AT A GLANCE -->
    <v-row>

      <v-col align="center">

        <v-row class="mb-5">
          <v-col>
            <h2 class="display-1">At a Glance <span v-if="compareData">for You</span></h2>
          </v-col>
        </v-row>

        <v-row>
          <!-- // TODO: Do NOT hardcode this, use a computed property -->
          <top-item :images="listening_data.artists[2].items[0].images" type="artist" :name="listening_data.artists[2].items[0].name"
          ></top-item>
          <top-item :images="listening_data.tracks[2].items[0].images" type="track" :name="listening_data.tracks[2].items[0].name"></top-item>
          <top-item type="genre" :name="topGenre"></top-item>
        </v-row>

      </v-col>
  

      <v-col align="center" v-if="compareData">

        <v-row>
          <v-col>
            <h2 class="display-1">At a Glance <span v-if="compareData">for {{sharedUser.profile.display_name}}</span></h2>
          </v-col>
        </v-row>

        <v-row>
          <!-- // TODO: Do NOT hardcode this, use a computed property -->
          <top-item :images="sharedUser.data.artists[2].items[0].images" type="artist" :name="sharedUser.data.artists[2].items[0].name"
          ></top-item>
          <top-item :images="sharedUser.data.tracks[2].items[0].images" type="track" :name="sharedUser.data.tracks[2].items[0].name"></top-item>
          <top-item type="genre" :name="topGenre"></top-item>
        </v-row>

      </v-col>

    </v-row>


    <v-divider class="mb-3"></v-divider>

    <!-- // ^ TOP-LISTS COMPONENT (ARTISTS) -->
    <v-row>

      <v-col>

        <!-- // List headline  -->
        <h2 :align="align" class="display-1 mb-7">Your Top Artists From              
          <span v-if="Number(artistTimeFrame)===0">the Last Month</span>
          <span v-if="Number(artistTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(artistTimeFrame)===2">All Time</span>
        </h2>

        <!-- // List Radio Group for time frame -->
        <v-radio-group v-model="artistTimeFrame" row mandatory>
          <v-radio label="Last Month" value="0" color="#1DB954"></v-radio>
          <v-radio label="Last 6 Months" value="1" color="#1DB954"></v-radio>
          <v-radio label="All Time" value="2" color="#1DB954"></v-radio>
        </v-radio-group>

        <!-- // List -->
        <top-lists :data="listening_data" :compareData="compareData" listType="artists" :timeFrame="artistTimeFrame">
        </top-lists>

        <v-row v-if="!listening_data">
          <v-col v-for="(index) in 10" :key="index">
            <v-skeleton-loader tile type="v-list-item-avatar"></v-skeleton-loader>
          </v-col>
        </v-row>
  

      </v-col>


      <v-divider vertical v-if="compareData"></v-divider>


      <v-col v-if="compareData">


        <h2 :align="align" class="display-1 mb-7">{{sharedUser.profile.display_name}}'s Top Artists From           
          <span v-if="Number(artistTimeFrame)===0">the Last Month</span>
          <span v-if="Number(artistTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(artistTimeFrame)===2">All Time</span>
        </h2>

        <top-lists :data="sharedUser.data" :compareData="compareData" listType="artists" :timeFrame="artistTimeFrame">
        </top-lists>


      </v-col>

    </v-row>


    <v-divider class="mb-3"></v-divider>

    <!-- // ^ TOP-LISTS COMPONENT (TRACKS) -->
    <v-row>

      <v-col>

        <h2 :align="align" class="display-1 mb-7">Your Top Tracks From 
          <span v-if="Number(trackTimeFrame)===0">the Last Month</span>
          <span v-if="Number(trackTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(trackTimeFrame)===2">All Time</span>
        </h2>

        <v-radio-group v-model="trackTimeFrame" row mandatory>
          <v-radio label="Last Month" value="0" color="#1DB954"></v-radio>
          <v-radio label="Last 6 Months" value="1" color="#1DB954"></v-radio>
          <v-radio label="All Time" value="2" color="#1DB954"></v-radio>
        </v-radio-group>

        <top-lists :data="listening_data" :compareData="compareData" listType="tracks" :timeFrame="trackTimeFrame">
        </top-lists>

      </v-col>

      <v-divider vertical v-if="compareData"></v-divider>

      <v-col v-if="compareData">

        <h2 :align="align" class="display-1 mb-7">{{sharedUser.profile.display_name}}'s Top Artists From
          <span v-if="Number(trackTimeFrame)===0">the Last Month</span>
          <span v-if="Number(trackTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(trackTimeFrame)===2">All Time</span>
        </h2>

        <top-lists :data="sharedUser.data" :compareData="compareData" listType="tracks" :timeFrame="trackTimeFrame">
        </top-lists>

      </v-col>

    </v-row>


    <v-divider class="mb-3"></v-divider>

    <!-- // ^ TOP GENRE -->
    <v-row>
      <v-col>
        <h2 :align="align" class="display-1 mb-7">Your Top Genres from
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

      <v-divider vertical v-if="compareData"></v-divider>

      <!-- // TODO: conditionally render shared user word cloud -->
      <v-col v-if="compareData">
        <h2 :align="align" class="display-1 mb-7">{{sharedUser.profile.display_name}}'s Top Genres from
          <span v-if="Number(genreTimeFrame)===0">the Last Month</span>
          <span v-if="Number(genreTimeFrame)===1">the Last 6 Months</span>
          <span v-if="Number(genreTimeFrame)===2">All Time</span>
        </h2>

        <top-genres :data="sharedUser.data.artists" :compareData="compareData" listType="genres" :timeFrame=genreTimeFrame></top-genres>
      </v-col>

    </v-row>

    <!-- // ! POPULARITY / AUDIO FEATURES CHART -->
    <v-row>
      <v-col>
        <!-- // TODO: Render popularity chart of artists -->
      </v-col>
      <v-col>
        <!-- // TODO: conditionally render sharedUser chart -->
      </v-col>
    </v-row>

    <!-- // ^ SHARE-LINK COMPONENT -->
    <share-link :shareable_link="shareable_link" :sharing="sharing" @updateSharing="sharing = $event"></share-link>

  </v-container>
</template>

<script>
// import querystring from 'querystring';
import api from '../services/api/api';
import helper from '../services/helper'
// import wordcloud from '../../node_modules/wordcloud';
// import cloud from '../../node_modules/d3-cloud';
import _TopItem from './_TopItem.vue';
import _ShareLink from './_ShareLink.vue';
import _TopLists from './_TopLists.vue';
import _TopGenres from './_TopGenres.vue';

export default {
  data() {
    return {
      display_name: "",
      user_id: "",
      profile_image: "",
      shareable_link: "",
      listening_data: {
        artists: [],
        tracks: []
      },
      sharedUser: {},
      sharing: false,
      sharedUserExists: false,
      compareData: false,
      artistTimeFrame: 0,
      trackTimeFrame: 0,
      genreTimeFrame: 0,
      vuetify: {
        closeOnContentClick: false
      },
      dataArrived: false
    }
  },
  components: {
    'top-item': _TopItem,
    'share-link': _ShareLink,
    'top-lists': _TopLists,
    'top-genres': _TopGenres
  },
  watch: {
    sharing() {
      // console.log(this.sharing);
      api.setShare({ id: this.user_id, share: this.sharing}, localStorage.getItem("apitoken"), this).then((res)=> {
        return res
      }).catch(e=> {
        if (e.status === 401) {
          api.getToken({id: this.user_id, display_name: this.display_name}, this).then((token)=> {
            localStorage.setItem("apitoken", token);

            api.setShare({ id: this.user_id, share: this.sharing}, localStorage.getItem("apitoken"), this).then(()=> {}).catch((err)=>{return err;})

            }).catch(err=> {
              return err;
              // TODO: Deal with 403 and 500 error here
            })
        } else {
        // TODO: Deal with non 401 errors from setting share permissions
        }
      })
    },
    radioGroup() {
      //console.log(this.radioGroup)
    }
  },
  computed: {
    align() {
        if (this.compareData) {
          return "center";
        }
        return "start"
    },
    topGenre() {
      let topGenres = {};
      // HARDCODE
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
  methods: {
    logout() {
      sessionStorage.removeItem("data");
      sessionStorage.removeItem("sharedUser");
      localStorage.removeItem("user");
      localStorage.removeItem("apitoken");
      helper.setState(this);
      this.$router.push('/');
    }
  },
  // TODO: Add before route enter logic
  beforeCreate() {
    // Set the state of the application based on browser cache
    //console.log("===DASHBOARD===")
    helper.setState(this);
    //console.log("Data cached: " , this.$store.state.dataCached);
    //console.log("Logged In: ", this.$store.state.loggedIn);
    //console.log("Token Expired: ", this.$store.state.tokenExpired);
    //console.log("sharedUser", this.$store.state.sharedUser);
  },
  created() {
    const updateState = async () => {
      if (!this.$store.state.loggedIn) {

        if (helper.validHashParams()) {
          //console.log("Valid hash in URL");

          // ^ Get the params from the url and store them in an object. Add a timestamp to the object and create the string access token as well
          let hashObj = helper.getHashParams();
          let time = Math.floor(new Date().getTime() / 1000);
          hashObj["time"] = time;
          let spotifyToken = JSON.stringify(hashObj.access_token);
          spotifyToken = spotifyToken.slice(1, spotifyToken.length - 1);

          // ^ Get profile data and listening data
          let listeningData;
          let profileData;

          // ^ Request current user's profile and data from Spotify
          try {
            listeningData = await api.getUserListeningData(spotifyToken, this);
            profileData = await api.getCurrentUserProfile(spotifyToken, this);
          } catch (e) {
            if (e & e.status === 401) {
              localStorage.removeItem("user");
              sessionStorage.removeItem("data");
              localStorage.removeItem("apitoken");
              helper.setState(this);
              this.$router.push('/');
            } else {
              // TODO: GIVE USER AN ERROR MESSAGE, APPLICATION IS NOT AVAILABLE, SOMETHING
              //console.log(e);
            }
          }

          // ^ Add id and display_name to hasObj that will be stored in localStorage
          hashObj["id"] = profileData.id;
          hashObj["display_name"] = profileData.display_name;
          
          // ^ Check if user has a profile picture, otherwise, use a default profile from Lorem Picsum
          if (profileData.images.length) {
            hashObj["profile_image"] = profileData.images[0].url;
          } else {
            hashObj["profile_image"] = "https://picsum.photos/id/1025/250/250.jpg?grayscale"
          }

          let filteredListeningData = {
            profile: profileData,
            id: profileData.id,
            data: {
              artists: [],
              tracks: [],
            }
          }
          // ^ Filter and Compress data from Spotify to be saved in DB
          listeningData.forEach((item, index)=> {
            //! HARDCODE
            if (index < 3) {
              filteredListeningData.data.artists.push(helper.compressData(helper.cleanArtistData(item)));
            } else {
              filteredListeningData.data.tracks.push(helper.compressData(helper.cleanTrackData(item)))
            }
          })
          //console.log("THIS IS THE LISTENING DATA", listeningData);
        
          //! GET JWT TOKEN FROM BACKEND HERE 
          try {
            let token = await api.getToken({id: profileData.id, display_name: 
            profileData.display_name}, this);
            localStorage.setItem("apitoken", token);
          } catch(e) {
            // TODO: Give an error message here, maybe "application is not available right now"
            console.log(e);
          }

          // ^ Save the filtered and compressed data in the db
          try { 
            await api.saveUser(filteredListeningData, this);
            //console.log("Successfully stored user's profile in database")
          } catch(e) {
            // TODO: If error saving to db, push user back to login, or, again give application not available message
            //console.log("There was an error saving the user to the db");
            localStorage.removeItem("user");
            sessionStorage.removeItem("data");
            localStorage.removeItem("apitoken");
            helper.setState(this);
            this.$router.push('/');
          }

          // ^ Cache the data in sessionStorage
          sessionStorage.setItem("data", JSON.stringify(filteredListeningData.data));
          helper.setState(this);
          //console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")))

          // ^ Cache the token with profile info in localStorage
          localStorage.setItem("user", JSON.stringify(hashObj));
          helper.setState(this);
          //console.log("Logged in: ", JSON.parse(localStorage.getItem("user")));
          //console.log(this.$store.state.loggedIn);

          // ^ Set up Vue data vars 
          this.display_name =  profileData.display_name;
          this.user_id =  profileData.id;
          this.shareable_link = `${process.env.VUE_APP_FRONTEND_URL}/user/${this.user_id}`;


          let token = localStorage.getItem("apitoken");
          let sharing; 
          try {
            sharing = await api.getShare(token, this);
            this.sharing = sharing.body;
          } catch(e) {
            if (e.status === 401) {
              try {
                let token = await api.getToken({id: this.user_id, display_name: this.display_name}, this);
                localStorage.setItem("apitoken", token);

                sharing = await api.getShare(token, this);
                this.sharing = sharing.body;

              } catch (e) {
                // TODO: Deal with error involving getting token, maybe "application error message"
              }
            }
          }

          if (profileData.images.length) {
            this.profile_image = profileData.images[0].url;
          } else {
            this.profile_image = "https://picsum.photos/id/1025/250/250.jpg?grayscale"
          }
          
          listeningData.forEach((item, index)=> {
            // HARDCODE
            if (index < 3) {
              this.listening_data.artists.push(helper.cleanArtistData(item));
            } else {
              this.listening_data.tracks.push(helper.cleanTrackData(item));
            }
          })
        }
        else {
          // ^ If the user isn't logged in and there's no valid hash in url, push them out
          localStorage.removeItem("user");
          localStorage.removeItem("apitoken");
          sessionStorage.removeItem("data");
          helper.setState(this);
          this.$router.push("/");
        }
      }
      if (this.$store.state.loggedIn) {


        //! CHECK IF CURRENT TOKEN IS EXPIRED, IF SO, REFRESH
        let payload = localStorage.getItem("apitoken").split(".")
        payload = atob(payload[1]);
        let timenow = Math.floor(new Date().getTime() / 1000)
        if (Number(payload.exp) <= timenow) {
          let token; 
          let id = JSON.parse(localStorage.getItem("user")).id;
          let display_name = JSON.parse(localStorage.getItem("user")).display_name;
          try {
            token = await api.getToken({id, display_name}, this);
            localStorage.setItem("apitoken", token);
          } catch(e) {
            // TODO: Decide what to do with a JWT error
            console.log(e);
          }
        }
        
        if (Object.keys(this.$store.state.sharedUser).length || sessionStorage.getItem("sharedUser")) {

          let sharedUserId;
          if (this.$store.state.sharedUser.id) {
            sharedUserId = this.$store.state.sharedUser.id;
            
          } else {
            sharedUserId = sessionStorage.getItem("sharedUser");
          }

          if (sharedUserId === JSON.parse(localStorage.getItem("user")).id) {
            // TODO: Empty conditional
            //console.log("this is you man");
          } else {
            //console.log("This is a diff user")
            this.sharedUserExists = true;

            try { 
              let user = await api.getUser(sharedUserId, this);

              // TODO: No need to store other user in vuex store, only need id in there
              this.$store.state.sharedUser.profile = user.body.profile;
              this.$store.state.sharedUser.data = { artists:[], tracks:[] }

              for (let key in user.body.data) {
                user.body.data[key].forEach(item=> {
                  if (key === "artists") {
                    this.$store.state.sharedUser.data.artists.push(helper.decompressData(item))
                  } else {
                    this.$store.state.sharedUser.data.tracks.push(helper.decompressData(item))
                  }
                })
              }
              this.sharedUser = this.$store.state.sharedUser;
              // console.log("sharedUser", this.sharedUser);
              this.compareData = true;
              //console.log(this.$store.state.sharedUser);
            } catch(e) {
              if (e) {
                if (e.status === 401) {
                  // TODO: Create error message for user
                  //console.log("You do not have permission to view this");
                }
                if (e.status === 404) {
                  // TODO: Create error message for user
                  //console.log("This user does not exist");
                }
              }
            }
          }
        }
    

        if (!this.$store.state.dataCached) {
          //console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")));
          let token = localStorage.getItem("apitoken");
          let userData = await api.getCurrentUser(token, this);

          sessionStorage.setItem("data", JSON.stringify(userData.body.data));
          helper.setState(this);
          //console.log("Data wasn't cached, but we got it from db");
        }

        let profile = JSON.parse(localStorage.getItem("user"));
        this.display_name = profile.display_name;
        this.user_id = profile.id;
        this.profile_image = profile.profile_image;
        this.shareable_link = `${process.env.VUE_APP_FRONTEND_URL}/user/${this.user_id}`
        let dataArr = JSON.parse(sessionStorage.getItem("data"));
        // TODO: Protect sharing route
        let token = localStorage.getItem("apitoken");
        let sharing; 
        try {
          sharing = await api.getShare(token, this);
          this.sharing = sharing.body;
        } catch(e) {
          if (e.status === 401) {
            try {
              let token = await api.getToken({id: this.user_id, display_name: this.display_name}, this);
              localStorage.setItem("apitoken", token);

              sharing = await api.getShare(token, this);
              this.sharing = sharing.body;
            } catch (e) {
              // TODO: Deal with error involving getting token, maybe "application error message"
            }
          }
        }

        // ^Decompress data from sessionStorage and place it in variable
        for (let key in dataArr) {
          dataArr[key].forEach((item)=> {
            if (key === "artists") {
              this.listening_data.artists.push(helper.decompressData(item))
            } else {
              this.listening_data.tracks.push(helper.decompressData(item));
            }
          })
        }
        
      }
      helper.printState(this);
    }

    updateState().then(()=> {
      this.dataArrived = true;
    }).catch(e=> {
      // TODO: Simulate long loads using dataArrived in order to test skeleton loaders
      console.log(e);
    });
  }
}
</script>

<style scoped lang="scss">
  img.welcome-image {
    height: 150px;
    width: auto;
    border-radius: 5px;
  }

  #wordcloud {
    height: 300px;
  }

  .custom-avatar {
    border-radius: 4px;

    @media screen and (min-width: 700px) {
      min-width: 70px;
    }
  }
  .custom-list-item {
    align-content: center;
  }
  h2 {
    text-decoration: underline;
  }
  label[for="menuShareSwitch"] {
    margin-left: 5px;
  }
  canvas {
    align-content: center;
    justify-content: center;
  }

/*   .container {
    height: 100%;
    background: #00a264;
    background: -moz-linear-gradient(45deg, #00a264 10%, #8b00be 100%);
    background: -webkit-linear-gradient(45deg, #00a264 10%, #8b00be 100%);
    background: linear-gradient(45deg, #00a264 10%, #8b00be 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#00a264", endColorstr="#8b00be",GradientType=1 );
    } */

</style>