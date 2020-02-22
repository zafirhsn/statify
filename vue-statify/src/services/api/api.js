import VueResource from "vue-resource"
import helper from '../helper'
import querystring from 'querystring';
import Vue from "vue";

Vue.use(VueResource);

export default {
  async getCurrentUserProfile(access_token, comp) {
    try {
      let profile = await comp.$http.get("https://api.spotify.com/v1/me", {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      console.log("Successfully got user's profile from Spotify");
      let display_name = profile.body.display_name;
      let email = profile.body.email;
      let id = profile.body.id;
      let images = profile.body.images;
      let filteredData = {
        display_name, 
        email, 
        id,
        images
      }
      await comp.$http.post("http://localhost:3000/storeuser", filteredData)
      console.log("Successfully stored user's profile in database");
      return filteredData;
    } catch(err) {
      return err;
    }
  },
  authorizeUser() {
    let state = helper.generateRandomString();
    let url  = "https://accounts.spotify.com/authorize?" + 
    querystring.stringify({
      client_id: "d4557495633b429a85292698a89e5978",
      response_type: "token",
      redirect_uri: "http://localhost:8080/dashboard",
      state: state,
      scope: "user-read-private user-read-email user-read-birthdate user-top-read user-library-read user-read-recently-played"
    });
    window.location = url;
  }
}
