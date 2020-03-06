<template>
  <v-row>
    <v-col v-for="(item, index) of userData[Number(timeFrameCaught)].items" :key="index" :sm="numColSm" :md="numColMd" :lg="numColLg">
      <v-list>
        <v-list-item>
          <v-list-item-avatar tile size="56" class="custom-avatar">
            <v-img :src="item.images"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <span v-if="listType==='artists'">{{index+1}}. {{item.name}}</span>
              <span v-if="listType==='tracks'">{{index+1}}. {{item.name}} by {{item.artists.name}}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      data: Object,
      compareData: Boolean,
      listType: String,
      timeFrame: Number
    },
    computed: {
      timeFrameCaught() {
        if (!this.timeFrame) {
          return 0
        }
        return this.timeFrame
      },
      userData() {
        if (this.listType === "artists") {
          return this.data.artists;
        } else if (this.listType === "tracks") {
          let filteredData = { 
            profile: this.data.profile,
            artists: this.data.artists,
            tracks: []  
          }
          for (let res of this.data.tracks) {
            let temp = [];
            for (let i = 0; i < 10; i++) {
              temp.push(res.items[i]);
            }
            filteredData.tracks.push({items: temp});
          }
          console.log(filteredData)
          return filteredData.tracks;
          }
        return this.data.artists;
      },
      numColSm() {
        if (this.compareData) {
          return 12;
        }
        if (this.listType === "tracks") {
          return 12
        }
        return 6;
      },
      numColMd() {
        if (this.compareData) {
          if (this.listType === "tracks") {
            return 12;
          }
          return 6
        }
        if (this.listType === "tracks") {
          return 6
        }
        return 4
      },
      numColLg() {
        if (this.compareData) {
          if (this.listType === "tracks") {
            return 12
          }
          return 6
        }
        if (this.listType === "tracks") {
          return 6;
        }
        return 4;
      }
    }
  }
</script>

<style scoped lang="scss">
  .custom-avatar {
    border-radius: 4px;

    @media screen and (min-width: 700px) {
      min-width: 70px;
    }
  }
  h2 {
    text-decoration: underline;
  }
</style>