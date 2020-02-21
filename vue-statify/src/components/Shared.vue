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
      if (!localStorage.getItem("token")) {
        console.log()
      }
    },
    created() {

    }
  }
</script>

<style> 

</style>