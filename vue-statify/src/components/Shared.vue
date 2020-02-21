<template>
  <div>

		<div class="row">
			<div class="col">
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>
    <div> 
      This is data. Enjoy it. Savor it. {{localStorageExpired()}}
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
      if (!localStorage.getItem("token")) {
        console.log()
      } else {
        this.$router.push("/dashboard", )
      }
    },
    created() {

    }
  }
</script>

<style> 

</style>