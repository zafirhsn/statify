<template>
  <div>
    <div class="row">
			<div class="col" id="welcome" align="center">
				<p>Welcome, {{display_name}}</p>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<img id="pic" src="#" class="rounded-circle">
			</div>
		</div>

    <button type="button" @click="share()">Share</button>
    <input type="text" value="laksjdlaskjd" v-if="clicked">
  </div>
</template>

<script>
export default {
  data() {
    return {
      display_name: "Zafir",
      clicked: false
    }
  },
  methods: {
    share() {
      this.clicked = true;
    },
    /* eslint-disable */
    getHashParams() {
      let hashParams = {};
      let e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }
  }
  /* eslint-enable */,
  created() {
    console.log(this.getHashParams());
    localStorage["token"] = this.getHashParams();
  }
}
</script>

<style scoped>

</style>