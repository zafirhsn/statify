<template>
  <v-row class="mb-8">
    <v-col align="center">
      <!-- Share button and input field link --> 
      <!-- TODO: Turn share button into a switch-->
      <v-switch inset color="#1DB954" label="Share Link" messages="Anyone with this link can view your data" v-model="clicked" class="label" @click="share()">Share</v-switch>
      <!-- TODO: Custom style the input field -->
      <v-fade-transition hide-on-leave>
        <v-row justify="center" v-if="clicked">
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
      clicked: Boolean
    },
    methods: {
      share() {
        this.$emit("updateClicked", this.clicked);

      },
      copyLink() {
        if (this.clicked) {
          navigator.clipboard.writeText(this.shareable_link).then(()=> {
            console.log("copying successfull");
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
</style> 