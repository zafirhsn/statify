<template>
  <v-col>
    <p class="headline font-weight-light">Top {{Uppercasetype}}</p>

    <v-list>
      <v-list-item class="center-list">
        <v-list-item-avatar tile size="48" class="custom-avatar"  v-if="images">
          <v-img :src="images"></v-img>
        </v-list-item-avatar>

        <v-list-item-content class="content-center">
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
    watch: {

    },
    computed: {
      Uppercasetype() {
        return this.type[0].toUpperCase() + this.type.substring(1, this.type.length);
      },
      Uppercasename() {
        return this.name[0].toUpperCase() + this.name.substring(1, this.name.length);
      }
    },
    created() {

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
  .center-list {
    justify-content: center;
  }

  .content-center {
    flex: none;
  }

  .headline {
    text-decoration: underline;
  }



</style>