<template>
  <v-row>
    <v-col align="center">
      <!-- Share button and input field link --> 
      <!-- TODO: Turn share button into a switch-->
      <v-switch inset color="#1DB954" label="Share Link" messages="Anyone with this link can view your data" v-model="clicked" class="label" @click="share()">Share</v-switch>
      <!-- TODO: Custom style the input field -->
      <v-text-field ref="shareInput" :value="shareable_link" v-show="clicked"></v-text-field>
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
      if (this.clicked) {
        navigator.clipboard.writeText(this.shareable_link).then(()=> {
          console.log("copying successfull");
        })
        }
      },
      updateClicked() {
        this.$emit("updateClicked", this.clicked);
      }
    }
  }
</script>

<style scoped lang="scss">
  .label {
    max-width: 250px;
  }
</style> 