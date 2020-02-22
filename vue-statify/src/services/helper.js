
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
  generateRandomString() {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let length = 16;
    let state = "";
    for (let i = 0; i < length; i++) {
      state += letters[Math.floor(Math.random() * letters.length)];
    }
    return state;
  },
  /** 
  @param {Object} tokenObj JSON object of token in localStorage
   */
  tokenLessThanOneDay(tokenObj = {}) {
    if (!Object.keys(tokenObj).length) {
      return false;
    }
    let now = Math.floor(new Date().getTime() / 1000);
    let day = Number(tokenObj.expires_in) * day;
    return (now - tokenObj.time < day);
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
  }
  
}
