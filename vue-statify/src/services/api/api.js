import VueResource from "vue-resource"
import Vue from "vue";

Vue.use(VueResource);

export default {
  async getCurrentUserProfile(access_token, comp) {
    let profile = await comp.$http.get("https://api.spotify.com/v1/me", {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    //console.log("Successfully got user's profile from Spotify");
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
  },
  async getUserListeningData(access_token, comp) {
    // Requesting all top artists on spotify
    let options = {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    };
    
    let listeningData = await Promise.all([
      comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50", options), 
      comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", options), 
      comp.$http.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", options), 
      comp.$http.get("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50", options),
      comp.$http.get("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", options),
      comp.$http.get("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", options)])
    //console.log("Successfully recieved listening data from Spotify");
    return listeningData;
  },

  async saveUser(data, comp) {
    return comp.$http.post(`${process.env.VUE_APP_BACKEND_URL}/storeuser`, data);
  },
  async getCurrentUser(token, comp) {
    return comp.$http.get(`${process.env.VUE_APP_BACKEND_URL}/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  },
  async getUser(id, comp) {
    return comp.$http.get(`${process.env.VUE_APP_BACKEND_URL}/getuser/${id}`);
  },
  async setShare(data, token, comp) {
    return comp.$http.post(`${process.env.VUE_APP_BACKEND_URL}/setshare`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  },
  async getShare(token, comp) {
    return comp.$http.get(`${process.env.VUE_APP_BACKEND_URL}/getshare`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  },
  async getToken(payload, comp) {
    let res = await comp.$http.post(`${process.env.VUE_APP_BACKEND_URL}/token`, payload);
    return res.body;
  }
}
