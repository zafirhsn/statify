import querystring from 'querystring';


export default {
  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  },
  validHashParams() {
    let hashObj = this.getHashParams();
    let numargs = 4;
    return (Object.keys(hashObj).length === numargs && hashObj.hasOwnProperty("access_token") && hashObj.hasOwnProperty("token_type") && hashObj.hasOwnProperty("expires_in") && hashObj.hasOwnProperty("state") && hashObj["state"] === localStorage.getItem("state"))
  },
  generateRandomString() {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let length = 16;
    let state = "";
    for (let i = 0; i < length; i++) {
      state += letters[Math.floor(Math.random() * letters.length)];
    }
    return state;
  },
  generateAuthorizationString() {
    let state = this.generateRandomString();
    let url  = "https://accounts.spotify.com/authorize?" + 
    querystring.stringify({
      client_id: "d4557495633b429a85292698a89e5978",
      response_type: "token",
      redirect_uri: "http://localhost:8080/dashboard",
      state: state,
      scope: "user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private"
    });
    return {state, url};
  },
  /** 
  @param {Object} tokenObj JSON object of token in localStorage
   */
  tokenLessThanOneDay(tokenObj = {}) {
    if (!Object.keys(tokenObj).length) {
      return false;
    }
    let now = Math.floor(new Date().getTime() / 1000);
    let day = Number(tokenObj.expires_in) * 24;
    return ((now - tokenObj.time) < day);
  },
  tokenExpired(tokenObj = {}) {
    if (!Object.keys(tokenObj).length) {
      return true;
    } 
    let now = Math.floor(new Date().getTime() / 1000);
    return (now - tokenObj.time >= Number(tokenObj.expires_in));
  },
  setInitialState(comp) {
    let tokenObj = {};
    if (localStorage.getItem("token")) {
      tokenObj = JSON.parse(localStorage.getItem("token"));
    }
    if (!localStorage.getItem("token") || !this.tokenLessThanOneDay(tokenObj)) {
      comp.$store.state.loggedIn = false;
    } else {
      comp.$store.state.loggedIn = true;
    }
    if (!sessionStorage.getItem("data")) {
      comp.$store.state.dataCached = false;
    } else {
      comp.$store.state.dataCached = true;
    }
    if (localStorage.getItem("token") && !this.tokenExpired(tokenObj)) {
      comp.$store.state.tokenExpired = false;
    } else {
      comp.$store.state.tokenExpired = true;
    }
  },
  printState(comp) {
    console.log("Data cached: ", comp.$store.state.dataCached);
    console.log("Logged In: ", comp.$store.state.loggedIn);
    console.log("Token Expired: ", comp.$store.state.tokenExpired);
  }
  
}
