
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
  
}