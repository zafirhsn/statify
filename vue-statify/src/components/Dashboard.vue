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
      this.$http.post("http://localhost:3000/").then((res)=>{
        console.log(res);
      })
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
    let hashObj = this.getHashParams();
    let numargs = 4;
    if (Object.keys(hashObj).length === numargs && hashObj.hasOwnProperty("access_token") && hashObj.hasOwnProperty("token_type") && hashObj.hasOwnProperty("expires_in") && hashObj.hasOwnProperty("state") && hashObj["state"] === localStorage.getItem("state")) {
      hashObj["time"] = Math.floor(((new Date()).getTime()) / 1000);
      localStorage.setItem("token", JSON.stringify(hashObj));
      console.log(hashObj);
    }
    let h = JSON.parse(localStorage.getItem("token"));
    console.log(h);
  }
}
</script>

<style scoped>

</style>