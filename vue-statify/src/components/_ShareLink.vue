<template>

  <v-row class="mb-8">

    <v-col align="center">

      <v-switch inset color="#1DB954" label="Compare Data" v-model="compareData" class="label-compare mb-n6" @click="compare()" v-if="sharedUserExists" ></v-switch>

      <v-switch inset color="#1DB954" label="Share Link" messages="Anyone with this link can view your data" v-model="sharing" class="label" @click="share()">Share</v-switch>

      <v-fade-transition>
        <v-row justify="center" v-if="sharing">
          <v-col sm="6" md="5" lg="4" xl="3" align="center">
            <v-text-field class="mt-8" outlined ref="shareInput" color="#1DB954" :value="shareable_link"></v-text-field>
            <v-btn style="display:inline-block" @click="copyLink()">Copy Link</v-btn>
          </v-col>
        </v-row>
      </v-fade-transition>

    </v-col>

  </v-row>

</template>

<script>
  export default {
    props: {
      shareable_link: String,
      sharing: Boolean,
      sharedUserExists: Boolean,
      compareData: Boolean
    },
    methods: {
      share() {
        this.$emit("updateSharing", this.sharing);
      },
      compare() {
        this.$emit("updateCompare", this.compareData);
      },
      copyLink() {
        if (this.sharing) {
          navigator.clipboard.writeText(this.shareable_link).then(()=> {
            //console.log("copying successfull");
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .label {
    max-width: 150px;
  }
  .label-compare {
    max-width: 200px
  }
</style> 