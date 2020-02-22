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
  export default {
    data() {
      return {

      }
    },
    methods: {

    },
    beforeCreate() {
      console.log("===SHARED===");
    },
    created() {
      this.$http.get(`http://localhost:3000/getuser/${this.$route.params.id})`).then(res=> {
        console.log(res);
      }).catch(err=> {
        // if ()
        console.log(err);
      })
    }
  }
</script>

<style> 

</style>