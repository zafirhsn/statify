const express = require('express');
const app = express();

app.listen(3000, ()=> {
  console.log('Server is listening on port 3000...');
});

app.use(express.static(__dirname + '/public/html'));
// app.use(express.static('public/css'));

