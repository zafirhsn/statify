<template>
  <div>

		<div class="row">
			<div class="col">
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>
    <div> 
      <div class="col" id="welcome">
        <p>Welcome, {{listening_data.profile.id}}</p>
        <!-- <p>Your id is {{user_id}}</p> -->
        <h2>Your Top Artists From the Last Month</h2>
        <ul>
          <li v-for="(artist, index) of listening_data.data[0].items" :key="index">{{artist.name}}</li>
        </ul>
        <h2>Your Top Artists From the Last 6 Months</h2>
        <ul>
          <li v-for="(artist, index) of listening_data.data[1].items" :key="index">{{artist.name}}</li>
        </ul>
			</div>
      <p v-if="error">{{errMsg}}</p>
    </div>
  </div>
</template>

<script>
import helper from '../services/helper';
import api from '../services/api/api'

  export default {
    data() {
      return {
        listening_data: {
          profile: {},
          data: []
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
        this.listening_data.profile = res.body.profile;

        for (let item of res.body.data) {
          this.listening_data.data.push(helper.decompressData(item));
        }
        
        console.log(this.listening_data.data);
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