// create a server variable
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("This is my first response");
});

const port = process.env.PORT || "3000";

console.log("Running on port " + port);
// listen at a port
server.listen(port);

