<template>
  <v-container fluid id="root-container"
  >
    <v-row class="justify-center">
      <v-col align="center" sm=10 md=8 lg=6>
        <v-overlay 
          :value="overlay"
        >

          <v-row class="justify-center">
            <v-col>
              <v-card 
                color="#fff"
                rounded
                min-width="350px"
              >
                <v-app-bar
                  :color=css.dark
                  height="40px"
                  flat

                >
                <v-spacer></v-spacer>
                </v-app-bar>

                <v-card-subtitle
                  class="pt-8"  
                >
                  <v-alert id="copy"
                    type="error"
                  >
                    {{errorMessage}}
                  </v-alert>
                </v-card-subtitle>

              <v-card-actions class="justify-center"> 
                  <v-btn
                    color="success"
                    medium
                    depressed
                    @click="closeOverlay()"
                  >
                  Ok
                  </v-btn>

                </v-card-actions>

              </v-card>
            </v-col>
          </v-row>
        </v-overlay>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    errorMessage: String
  },
  methods: {
    closeOverlay() {

      let close = async () => {
        localStorage.clear();
        // document.cookie=`_session=;max-age=0;domain=${process.env.VUE_APP_COOKIE_DOMAIN}`
        this.overlay = false;
      }

      close().then(()=> {
        this.$router.push('/');
      })

    }
  }
}
</script>

<style lang="scss" scoped>
  #root-container {
    font-family: 'Mulish', sans-serif;
  }

  #copy {
    font-size: 0.9rem;
  }

</style>