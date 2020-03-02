<template>
  <v-container>
    <!-- Navbar Here -->
    <!-- Conditionally render button if user is not logged in -->
    <v-row>
      <v-col>
        <p>{{sharedUser.profile.display_name}}</p>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import helper from '../services/helper';
import api from '../services/api/api'

  export default {
    data() {
      return {
        sharedUser: {
          id: "",
          profile: {},
          data: {
            artists: [],
            tracks: []
          }
        },
        error: false,
        errMsg: "",
        dataArrived: false
      }
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
        this.sharedUser.profile = res.body.profile;
        this.sharedUser.id = res.body.id;
      
        for (let key of res.body.data) {
          res.body.data[key].forEach(item=> {
            if (key === "artists") {
              this.sharedUser.data.artists.push(helper.decompressData(item));
            } else {
              this.sharedUser.data.tracks.push(helper.decompressData(item));
            }
          
          })
        }
        
        console.log(this.sharedUser.data);
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

<style> 

</style>