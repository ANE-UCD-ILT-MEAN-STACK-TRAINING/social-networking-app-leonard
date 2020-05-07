// create a server variable
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("This is my first response");
});

// listen at a port
server.listen(5001);
console.log("Listening");