<template>
  <v-row>
  <v-col>
    <!-- Top artists of last month  --> 
    <!-- TODO: Turn list bullets into artist pic -->
    <!-- TODO: Add skeleton loader using v-if directive-->
    <h2 :align="align" class="display-1 mb-7">Your Top {{capitalizedListType}} From the Last Month</h2>

    <v-row>
      <v-col v-for="(item, index) of userData[0].items" :key="index" :sm="numColSm" :md="numColMd" :lg="numColLg">
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
  </v-col>

  <v-divider vertical v-if="compareData"></v-divider>
  
  <v-col v-if="compareData">
    <h2 :align="align" class="display-1 mb-7">{{sharedUser.profile.display_name}}'s Top {{capitalizedListType}} From the Last Month</h2>

    <v-row>
      <v-col v-for="(item, index) of sharedUserData[0].items" :key="index" :sm="numColSm" :md="numColMd" :lg="numColLg">
        <v-list>
          <v-list-item>
            <v-list-item-avatar tile size="56" class="custom-avatar">
              <v-img :src="item.images"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span v-if="listType==='artists'" style="width:100%">{{index+1}}. {{item.name}}</span>
                <span v-if="listType==='tracks'">{{index+1}}. {{item.name}} by {{item.artists.name}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
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
      sharedUser: Object,
      listening_data: Object,
      compareData: Boolean,
      listType: String,
      timeFrame: Number
    },
    computed: {
      userData() {
        if (this.listType === "artists") {
          return this.listening_data.artists;
        } else if (this.listType === "tracks") {
          let filteredData = { 
            profile: this.listening_data.profile,
            artists: this.listening_data.artists,
            tracks: []  
          }
          for (let res of this.listening_data.tracks) {
            let temp = [];
            for (let i = 0; i < 10; i++) {
              temp.push(res.items[i]);
            }
            filteredData.tracks.push({items: temp});
          }
          return filteredData.tracks;
          }
          return this.listening_data.artists;
      },
      sharedUserData() {
        if (this.listType === "artists") {
          return this.sharedUser.data.artists;
        } else if (this.listType === "tracks") {
          let filteredData = { 
            profile: this.sharedUser.profile,
            data: {
              artists: this.sharedUser.data.artists,
              tracks: []
            }
          }
          for (let res of this.sharedUser.data.tracks) {
            let temp = [];
            for (let i = 0; i < 10; i++) {
              temp.push(res.items[i]);
            }
            filteredData.data.tracks.push({items: temp})
          }
          return filteredData.data.tracks;
        }
        return this.sharedUserData.data.artists;
      },
      capitalizedListType() {
        return this.listType[0].toUpperCase() + this.listType.substring(1, this.listType.length);
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
      },
      align() {
        if (this.compareData) {
          return "center";
        }
        return "start"
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