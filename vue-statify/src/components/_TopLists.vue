<template>


  <v-row>

    <!-- Each list is contained in a column. Each piece of data is a list with just one list item. -->
    <v-col v-for="(item, index) of userData[Number(timeFrameCaught)].items" :key="index" :sm="numColSm" :md="numColMd" :lg="numColLg">

      
      <v-list>
        <v-list-item>
          <v-list-item-avatar tile size="64" class="custom-avatar">
            <v-img :src="item.images"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <span v-if="listType==='artists'" :class ="similaritiesComp[item.id] > 1 && compareData ? 'similar' : 'not-similar'"> {{index+1}}. {{item.name}}</span>
              <span v-if="listType==='tracks'" :class ="similaritiesComp[item.id] > 1 && compareData ? 'similar' : 'not-similar'">{{index+1}}. {{item.name}} by {{item.artists.name}}</span>
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
      timeFrame: Number,
      similarities: Object
    },
    computed: {
      similaritiesComp() {
        if (!this.similarities) {
          return {};
        }
        return this.similarities;
      },
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
          //console.log(filteredData);
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
  }

  .similar {
    color: #ec5e5e;
  }

  .non-similar {
    color: black;
  }


</style>