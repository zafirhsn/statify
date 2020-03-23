<template>


  <v-col>
    <p class="headline font-weight-light">Top {{Uppercasetype}}</p>

    <v-list>
      <v-list-item class="center-list-item">
        <v-list-item-avatar tile size="64" class="custom-avatar" v-if="images">
          <v-img :src="images"></v-img>
        </v-list-item-avatar>

        <v-list-item-content class="center-list-content">
          <v-list-item-title>
            {{Uppercasename}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
  </v-col>

  
</template>


<script>

  export default {
    props: {
      images: String,
      name: String,
      type: String,
    },
    computed: {
      Uppercasetype() {
        return this.type[0].toUpperCase() + this.type.substring(1, this.type.length);
      },
      Uppercasename() {
        return this.name[0].toUpperCase() + this.name.substring(1, this.name.length);
      }
    } 
  }
</script>

<style scoped lang="scss">
  .custom-avatar {
      border-radius: 4px;
    }
    .center-list-item {
      justify-content: center;
    }
    .center-list-content {
      flex: none;
    }
    .headline {
      text-decoration: none;
    }
</style>