<template>
  
  <v-col align="center" class="my-10" >
    <p class="title">You and {{sharedUser.profile.display_name}} have <span class="display-2">{{numCommon}}</span> {{type}} in common from {{timeFrameText}}</p>

  </v-col>
  
</template>

<script>
  
export default {
  props: {
    sharedUser: Object,
    user: Object,
    timeFrame: String,
    type: String
  },
  data() {
    return {

    }
  },
  computed: {
    timeFrameText() {
      if (this.timeFrame === "0") {
        return "the last month";
      }
      if (this.timeFrame === "1") {
        return "the last 6 months";
      }
      return "all time";
    },
    userListData() {
      if (this.type === "artists") {
        return this.user.artists[Number(this.timeFrame)]
      }
      if (this.type === "tracks") {
        let filteredTracks = {};
        let temp = [];
        for (let i = 0; i < 10; i++) {
          temp.push(this.user.tracks[Number(this.timeFrame)].items[i]);
        }
        filteredTracks["items"] = temp;
        return filteredTracks;
      }
      let topGenres = {};
      let topGenresArr = [];
      for (let genre of this.user.artists[Number(this.timeFrame)].genres) {
        if (topGenres[genre]) {
          topGenres[genre]++;
        } else {
          topGenres[genre] = 1;
        }
      }
      for (let genre in topGenres) {
        topGenresArr.push([genre, topGenres[genre]]);
      }
      topGenresArr.sort((a, b)=> {
        return b[1] - a[1];
      })
      topGenresArr = topGenresArr.slice(0, 10);
      let filteredGenres = {};
      let temp = [];
      for (let genre of topGenresArr) {
        temp.push({id: genre[0]});
      }
      filteredGenres["items"] = temp;
      return filteredGenres;


    },
    sharedUserListData() {
      if (this.type === "artists") {
        return this.sharedUser.data.artists[Number(this.timeFrame)]
      }
      if (this.type === "tracks") {
        let filteredTracks = {};
        let temp = [];
        for (let i = 0; i < 10; i++) {
          temp.push(this.sharedUser.data.tracks[Number(this.timeFrame)].items[i]);
        }
        filteredTracks["items"] = temp;
        return filteredTracks;
      }
      let topGenres = {};
      let topGenresArr = [];
      for (let genre of this.sharedUser.data.artists[Number(this.timeFrame)].genres) {
        if (topGenres[genre]) {
          topGenres[genre]++;
        } else {
          topGenres[genre] = 1;
        }
      }
      for (let genre in topGenres) {
        topGenresArr.push([genre, topGenres[genre]]);
      }
      topGenresArr.sort((a, b)=> {
        return b[1] - a[1];
      })
      topGenresArr = topGenresArr.slice(0, 10);
      let filteredGenres = {};
      let temp = [];
      for (let genre of topGenresArr) {
        temp.push({id: genre[0]});
      }
      filteredGenres["items"] = temp;
      return filteredGenres;

    },
    numCommon() {
      let common = {};
      let numCommon = 0;

      for (let item of this.userListData.items) {
        if (!common[item.id]) {
          common[item.id] = 1;
        }
      }
      for (let item of this.sharedUserListData.items) {
        if (common[item.id]) {
          common[item.id] += 1;
          numCommon += 1;
        }
      }

      return numCommon;
      
    }
  }
  
}
</script>

<style scoped lang="scss">

  p {
    color: #ec5e5e;
  }

</style>