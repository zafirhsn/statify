<template>
  <div>

		<div class="row">
			<div class="col">
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>
    <div> 
      This is data. Enjoy it. Savor it. 
    </div>
  </div>
</template>

<script>
import helper from '../services/helper';

  export default {
    data() {
      return {

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
      // this.$http.get(`http://localhost:3000/getuser/${this.$route.params.id})`).then(res=> {
      //   console.log(res);
      // }).catch(err=> {
      //   // if ()
      //   console.log(err);
      // })
    }
  }
</script>

<style> 

</style>