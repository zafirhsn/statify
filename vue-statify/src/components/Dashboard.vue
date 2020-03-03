<template>
  <v-container fluid>
    <!-- Navbar here -->
    <!-- TODO: maybe make this collapsible to the right -->
    <v-app-bar fixed elevate-on-scroll height="80" color="indigo">
      <v-spacer></v-spacer>
      <!-- User image here -->
        <!-- TODO: Turn image into a floating button with a background image that is the profile picture-->
        <v-btn rounded></v-btn>
      <img class="profile-img" :src="profile_image">
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
        <h1 class="display-3">{{display_name}}</h1> 
      </v-col>
    </v-row>

    <v-row>
      <v-col align="center">
        <!-- Share button and input field link --> 
        <!-- TODO: Turn share button into a switch-->
        <v-switch inset color="#1DB954" label="Share Link" messages="Anyone with this link can view your data" v-model="clicked" class="label" @click="share()">Share</v-switch>
        <!-- TODO: Custom style the input field -->
        <v-text-field ref="shareInput" :value="shareable_link" v-show="clicked"></v-text-field>
        <button type="button" @click="authorizeUser()" v-if="token_expired">Refresh Data</button>
      </v-col>
    </v-row>

    <v-row v-if="compareData">
      <v-col>
        <!-- TODO: Conditionally render generate playlist button --> 
      </v-col>
    </v-row>

    <v-row>
      <v-col align="center">
        <!-- At a Glance --> 
        <v-row>
          <v-col>
            <h1 class="display-1">At a Glance</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <p class="title">Top Artist</p>
            <v-list>
              <v-list-item>
                <v-list-item-avatar tile size="48" class="custom-avatar">
                  <v-img :src="listening_data.artists[2].items[0].images"></v-img>
                </v-list-item-avatar>
    
                <v-list-item-content align="start">
                  <v-list-item-title>
                    {{listening_data.artists[2].items[0].name}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <p class="title">Top Track</p>
            <v-list>
              <v-list-item>
                <v-list-item-avatar tile size="48" class="custom-avatar">
                  <v-img :src="listening_data.tracks[2].items[0].images"></v-img>
                </v-list-item-avatar>
    
                <v-list-item-content align="start">
                  <v-list-item-title>
                    {{listening_data.tracks[2].items[0].name}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <p class="title">Top Genre</p>
          </v-col>
        </v-row>

      </v-col>


      <v-col align="center" v-if="compareData">
        <!-- Conditionally render col for shared user at a glance -->
        <v-row>
          <v-col>
            <h1 class="display-1">At a Glance</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <p>At a glance for other user</p>
          </v-col>
          <v-col>
            <p>{{sharedUser.data.tracks[0].items[0].name}}</p>
          </v-col>
          <v-col>
            aslkjalkj
          </v-col>
        </v-row>
        
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- Top artists of last month  --> 
        <!-- TODO: Turn list bullets into artist pic -->
        <!-- TODO: Add skeleton loader using v-if directive-->
        <h2 class="display-1">Your Top Artists From the Last Month</h2>
        <v-list>
          
          <v-list-item v-for="(artist, index) of listening_data.artists[0].items" :key="index">
            <v-list-item-avatar tile size="48" class="custom-avatar">
              <v-img :src="artist.images"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{artist.name}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-col>

      <v-col align="center" v-if="compareData">
        <p>Shared user top artists</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- Top tracks of last month  -->
        <!-- TODO: Turn list bullets into album art -->
          <h2 class="display-1">Your Top Tracks From the Last Month</h2>
          <v-list>
          
            <v-list-item v-for="(track, index) of filteredTracks[0]" :key="index">
              <v-list-item-avatar tile class="custom-avatar">
                <v-img :src="track.images"></v-img>
              </v-list-item-avatar>
  
              <v-list-item-content>
                <v-list-item-title>
                  {{track.name}} by {{track.artists.name}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>

      <v-col align="center" v-if="compareData">
        <p>Shared user top tracks</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col id="wordcloud" ref="wordcloud">
        <!-- Word cloud genre  --> 

      </v-col>
        <!-- TODO: conditionally render shared user word cloud -->
    </v-row>

    <v-row>
      <v-col>
        <!-- TODO: Render popularity chart of artists -->
      </v-col>
      <v-col>
        <!-- TODO: conditionally render sharedUser chart -->
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- Share button and input field  --> 
        <v-switch inset color="#1DB954" label="Share Link" v-model="clicked" hint="Share this" messages="Anyone with this link can view your data" @click="share()">Share</v-switch>
        <v-text-field ref="shareInput" :value="shareable_link" v-show="clicked"></v-text-field>
        <button type="button" @click="authorizeUser()" v-if="token_expired">Refresh Data</button>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
// import querystring from 'querystring';
import api from '../services/api/api';
import helper from '../services/helper'
import wordcloud from '../../node_modules/wordcloud';

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
      clicked: false,
      token_expired: false,
      // TODO: Set compareData to false at small viewport sizes
      compareData: false,
      sharedUser: {}
    }
  },
  computed: {
    filteredTracks() {
      let trackData = [];
      for (let track of this.listening_data.tracks) {
        let dataArr = []
        for (let i = 0; i < 10; i++) {
          dataArr.push(track.items[i]);
        }
        trackData.push(dataArr);
      }
      return trackData;
    },
    // topGenre() {

    // }
  },
  methods: {
    share() {
      if (this.clicked) {
        navigator.clipboard.writeText(this.shareable_link).then(()=> {
          console.log("copying succesfull");
        })
      }
    
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
    helper.setState(this);
    console.log("Data cached: " , this.$store.state.dataCached);
    console.log("Logged In: ", this.$store.state.loggedIn);
    console.log("Token Expired: ", this.$store.state.tokenExpired);
  },
  created() {

    const updateState = async () => {
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
              helper.setState(this);
              this.$router.push('/');
            } else {
              console.log(e);
            }
          }
          // Add id and display_name to hasObj that will be stored in localStorage
          hashObj["id"] = profileData.id;
          hashObj["display_name"] = profileData.display_name;
          hashObj["profile_image"] = profileData.images[0].url;

          let filteredListeningData = {
            profile: profileData,
            id: profileData.id,
            data: {
              artists: [],
              tracks: [],
            }
          }
          // Compress 
          listeningData.forEach((item, index)=> {
            if (index < 3) {
              filteredListeningData.data.artists.push(helper.compressData(helper.cleanArtistData(item)));
            } else {
              filteredListeningData.data.tracks.push(helper.compressData(helper.cleanTrackData(item)))
            }
          })
          console.log("THIS IS THE LISTENING DATA", listeningData);
            
          

          // Save the data in the db
          try { 
            await api.saveUser(filteredListeningData, this);
            console.log("Successfully stored user's profile in database")
          } catch(e) {
            console.log("There was an error saving the user to the db");
            localStorage.removeItem("token");
            sessionStorage.removeItem("data");
            helper.setState(this);
            this.$router.push('/');
          }

          // Cache the data in sessionStorage
          sessionStorage.setItem("data", JSON.stringify(filteredListeningData.data));
          helper.setState(this);
          console.log("Data cached: ", JSON.parse(sessionStorage.getItem("data")))

          // Cache the token with profile info in localStorage
          localStorage.setItem("token", JSON.stringify(hashObj));
          helper.setState(this);
          console.log("Logged in: ", JSON.parse(localStorage.getItem("token")));
          console.log(this.$store.state.loggedIn);

          // Set up Vue data vars 
          this.display_name =  profileData.display_name;
          this.user_id =  profileData.id;
          this.shareable_link = `http://localhost:8080/user/${this.user_id}`;
          this.profile_image = profileData.images[0].url;

          listeningData.forEach((item, index)=> {
            if (index < 3) {
              this.listening_data.artists.push(helper.cleanArtistData(item));
            } else {
              this.listening_data.tracks.push(helper.cleanTrackData(item));
            }
          })

          
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
              let user = await api.getUser(this.$store.state.sharedUser.id, this);

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
              console.log("sharedUser", this.sharedUser);
              this.compareData = true;
              console.log(this.$store.state.sharedUser);
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
          let userData = await api.getCurrentUser(id, this);

          sessionStorage.setItem("data", JSON.stringify(userData.body.data));
          helper.setState(this);
          console.log("Data wasn't cached, but we got it from db");
        }

        let profile = JSON.parse(localStorage.getItem("token"));
        this.display_name = profile.display_name;
        this.user_id = profile.id;
        this.profile_image = profile.profile_image;
        this.shareable_link = `http://localhost:8080/user/${this.user_id}`
        let dataArr = JSON.parse(sessionStorage.getItem("data"));
        
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

    updateState().then().catch(e=> {
      console.log(e);
    });

  },
  mounted() {
    let topGenres = {};
        for (let genre of this.listening_data.artists[0].genres) {
          if (topGenres[genre]) {
            topGenres[genre]++;
          } else {
            topGenres[genre] = 1;
          }
        }
        console.log(this.$refs);
        let wordcloudlist = [];
        for (let key in topGenres) {
          wordcloudlist.push([key, topGenres[key]]);
        }
        wordcloudlist.sort((a,b)=> {
          return b[1] - a[1];
        })
        // let finalList = wordcloudlist.splice(0,40);
        // console.log(wordcloudlist)

        // console.log(finalList);

        // TODO: Make word cloud mobile friendly
        wordcloud(document.getElementById("wordcloud"), {
          list: wordcloudlist,
          minSize: "14px",
          weightFactor: 10,
          gridSize: 10,
          color: "random-dark"
        })
        // wordcloud.
  }
}
</script>

<style scoped lang="scss">
  img.profile-img {
    height: 55px;
    width: auto;
    border-radius: 30px;
  }

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

  .label {
    max-width: 250px;
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