<template>


  <v-row>

    <!-- Each list is contained in a column. Each piece of data is a list with just one list item. -->
    <v-col v-for="(item, index) of genreData" :key="index" :sm="numColSm" :md="numColMd" :lg="numColLg">
  
      <v-list>
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title>
              <span :class="similaritiesComp[item[0]] > 1 && compareData ? 'similar' : 'not-similar'">{{index+1}}. {{item[0]}}</span>
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
      data: Array,
      compareData: Boolean,
      listType: String,
      timeFrame: String,
      similarities: Object
    },
    methods: {
      capitalizeGenre(genre) {
        let garr = genre.split(" ");
        let garr2 = [];
        for (let part of garr) {
          garr2.push(part[0].toUpperCase() + part.substring(1, part.length))
        }
        return garr2.join(" ");
      }
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
      genreData() {
        let topGenres = {};
        let topGenresArr = [];
        for (let genre of this.data[Number(this.timeFrame)].genres) {
          if (topGenres[genre]) {
            topGenres[genre]++;
          } else {
            topGenres[genre] = 1;
          }
        }
        for (let genre in topGenres) {
          let capitalizedGenre = this.capitalizeGenre(genre);
          topGenresArr.push([capitalizedGenre, topGenres[genre]]);
        }
        topGenresArr.sort((a, b)=> {
          return b[1] - a[1];
        })
        topGenresArr = topGenresArr.slice(0, 10);
        return topGenresArr
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

  .similar {
    color: #ec5e5e;
  }

  .not-similar {
    color: black;
  }

</style>