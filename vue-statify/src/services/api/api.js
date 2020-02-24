import VueResource from "vue-resource"
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
      return filteredData;
    } catch(err) {
      return err;
    }
  },
  getUserData(access_token, comp) {
    // Requesting all top artists on spotify
    console.log("Requesting all top artists on spotify");
    let options = {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    };
    
    return Promise.all([comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50", options), comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", options), comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", options)])
  },
  saveUser(data, comp) {
    comp.$http.post("http://localhost:3000/storeuser", data).then(res=> {
      console.log(res);
    }).catch(e=> {
      console.log(e);
    })
    console.log("Successfully stored user's profile in database")
  },
  async queryUser(id, comp) {
    return comp.$http.get(`http://localhost:3000/me/${id}`)
  }
  
}
